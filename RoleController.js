import Role from "../models/Role.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";



// Create  Role 
async function create(req, res) {
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json(message.failed("All input Required"));
  }
  let validation = new Validator(data, {
    role_name: 'required',
    role_description: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let role = await Role.findAll({ where: { role_name: req.body.role_name } });
  if (role.length != 0) {
    return res.json(message.failed(" This Role is already exists "));
  }

  Role.create(req.body).then((data) => res.json(message.success(" Role Created Successfully", data)))

};

// Get List of Roles
async function show(req, res) {
  // Search Filter
  const condition = {};
  if (req.query.role_name) {
    condition.role_name = req.query.role_name
  }
  
  const limit = parseInt(req.query.limit);
  if (!limit) {
    const role = await Role.findAll({
      where: condition, order: [
        ['id', 'DESC'],

      ]
    })
    return res.json(message.success("List Of All Role's", role))
  }
  let offset = 0;
  Role.findAndCountAll()
    .then((data) => {
      // let page = req.params.page;      
      const page = parseInt(req.query.page)
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      let currentPage = parseInt(page);
      let previousPage = (currentPage <= 1) ? null : (currentPage - 1);
      let nextPage = (currentPage >= pages) ? null : (currentPage + 1);
      Role.findAll({
        order: [
          ['id', 'DESC']
        ],
        attributes: ['id', 'role_name', 'role_description'],
        limit: limit,
        offset: offset,
        $sort: { id: 1 },
        where: condition,
       
      })
        .then((role) => {
          return (!role) ? res.json(message.failed("This Role is Not Found")) : res.json(message.success("List Of Role's", { 'count': data.count, 'totalPages': pages, 'perPage': limit, 'currentPage': currentPage, 'previousPage': previousPage, 'nextPage': nextPage, 'result': role }));
        });

    })

}

// Update a Role
async function update(req, res) {
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json(message.failed("All input required"));
  }
  let validation = new Validator(data, {
    role_name: 'required',
    role_description: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let role = await Role.findAll({ where: { role_name: req.body?.role_name } });
  if (role.length != 0) {
    return res.json(message.failed(" This Role is already exists "));
  }

  var roles = await Role.update(data, { where: { id: req.query.id } });
  return (roles != 0) ? res.json(message.success("Role updated successfully", data)) : res.json(message.failed("unable to update this Role"));
}

// Delete a Role
async function deletex(req, res) {
  const role = await Role.destroy({ where: { id: req.query.id } });
  return (role) ? res.json(message.success("Role Deleted Successfully")) : res.json(message.failed("This Role is not exists"));
}

// Export all Function's
export default {
  create, show, update, deletex
}