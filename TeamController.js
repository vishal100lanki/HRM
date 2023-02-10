import Team from "../models/Team.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";

// Create  Team 
async function create(req, res) {
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json(message.failed("All input required"));
  }
  let validation = new Validator(data, {
    team_name: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let team = await Team.findAll({ where: { team_name: req.body.team_name } });
  if (team.length != 0) {
    return res.json(message.failed(" This team is already exists "));
  }

  Team.create(req.body).then((data) => res.json(message.success(" Team Created Successfully", data)))
};

// Get List of Team
async function show(req, res) {


  // Search Filter
  const condition = {};
  if (req.query.team_name) {
    condition.team_name = req.query.team_name
  }
 
  const limit = parseInt(req.query.limit);
  if (!limit) {
    const team = await Team.findAll({
      where: condition,
      order: [
        ['id', 'DESC'],

      ]
    })
    return res.json(message.success("List of All Team's", team))
  }
  let offset = 0;
  Team.findAndCountAll()
    .then((data) => {

      const page = parseInt(req.query.page)
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      let currentPage = parseInt(page);
      let previousPage = (currentPage <= 1) ? null : (currentPage - 1);
      let nextPage = (currentPage >= pages) ? null : (currentPage + 1);
      Team.findAll({
        order: [
          ['id', 'DESC'],

        ],
        attributes: ['id', 'team_name'],
        limit: limit,
        offset: offset,
        $sort: { id: 1 },
        where: condition
      })
        .then((team) => {
          return (!team) ? res.json(message.failed("This Team is Not Found")) : res.json(message.success("List of All Team's", { 'count': data.count, 'totalPages': pages, 'perPage': limit, 'currentPage': currentPage, 'previousPage': previousPage, 'nextPage': nextPage, 'result': team }));
        });

    })

}


// Update a Team
async function update(req, res) {
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json(message.failed("All input  required"));
  }
  let validation = new Validator(data, {
    team_name: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  // let team = await Team.findAll({ where: { team_name: req.body.team_name } });
  // if (team.length != 0) {
  //   return res.json(message.failed(" This team is already exists "));
  // }

  var teams = await Team.update(data, { where: { id: req.query.id } });
  return (teams != 0) ? res.json(message.success("Team updated successfully", data)) : res.json(message.failed("unable to update This Team "));
}

// Delete a Team
async function deletex(req, res) {
  const team = await Team.destroy({ where: { id: req.query.id } });
  return (team) ? res.json(message.success("Team Deleted successfully")) : res.json(message.failed("This team is not exists"));
}

// Export all Function's
export default {
  create, show, update, deletex

}