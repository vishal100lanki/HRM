import Designation from "../models/Designation.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";

// Create  Designation 
async function create(req, res) {

  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json(message.failed("All input is required"));
  }
  let validation = new Validator(data, {
    designation_name: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }


  let designation = await Designation.findAll({ where: { designation_name: req.body.designation_name } });
  if (designation.length != 0) {
    return res.json(message.failed(" This Designation is already exists "));
  }

  Designation.create(req.body).then((data) => res.json(message.success( " Designation Created Successfully " , data)))

};





// Get List of Designation
async function show(req, res) {

  // Search Filter
  const condition = {};
  if(req.query.designation_name){ 
    condition.designation_name=req.query.designation_name
  }

  const limit = parseInt(req.query.limit);
  if(!limit){
    const designation = await Designation.findAll({where: condition,
      order: [
        ['id', 'DESC'],
   
    ]})
    return res.json(message.success("List Of All Designation's", designation))
  }
  let offset = 0;
  Designation.findAndCountAll()
  .then((data) => {
    // let page = req.params.page;      
    const page = parseInt(req.query.page)
    let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1);
        let currentPage = parseInt(page);
        let previousPage = (currentPage <= 1) ? null : (currentPage-1);
        let nextPage = (currentPage>= pages) ? null : (currentPage+1);
        Designation.findAll({ 
          order: [
            ['id', 'DESC'],
       
        ],
    attributes: ['id','designation_name'],
    limit: limit,
    offset: offset,
    $sort: { id: 1 },
    where: condition})
    .then((designation) =>{ return (!designation) ? res.json(message.failed("This Designation Not Found")) : res.json(message.success ("List of Designation",{'count': data.count, 'totalPages': pages, 'perPage' : limit, 'currentPage' : currentPage, 'previousPage': previousPage, 'nextPage' : nextPage, 'result': designation}));
  });

})

}



// Update a Designation
async function update(req, res) {
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json(message.failed("All input required"));
  }
  let validation = new Validator(data, { 
   designation_name: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let designation = await Designation.findAll({ where: { designation_name: req.body.designation_name } });
  if (designation.length != 0) {
    return res.json(message.failed(" This Designation is already exists "));
  }

  var designations = await Designation.update(data, { where: { id: req.query.id } });
  return (designations != 0) ? res.json(message.success("Designation updated successfully", data)) : res.json(message.failed("unable to update Designation"));
}




// Delete a Designation
async function deletex(req, res) {
  const designation = await Designation.destroy({ where: { id: req.query.id } });
  return (designation) ? res.json(message.success("Designation Deleted Successfully")) : res.json(message.failed("This Designation in not Exist"));
}





// Export all Function's
export default {
  create, show, update, deletex
}