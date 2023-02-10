import expenses_type from "../models/ExpensesType.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";

// Create  expenses_type 
async function create(req, res) {

  let data = req.body;
  if (!data) {
    return res.json(message.failed("All input  required"));
  }
  let validation = new Validator(data, {
    expenses_type: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let expenses = await expenses_type.findAll({ where: { expenses_type: req.body.expenses_type } });
  if (expenses.length != 0) {
    return res.json(message.failed(" This Expenses-Type is already exists "));
  }

  expenses_type.create(req.body).then((data) => res.json(message.success(" Expenses-Type Created Successfully", data)))

};

// Get List of Eexpensestype
async function show(req, res) {
  // Search Filter
  const condition = {};
  if(req.query.expenses_type){ 
    condition.expenses_type=req.query.expenses_type
  }
  

  const limit = parseInt(req.query.limit);
  if(!limit){
    const expenses = await expenses_type.findAll({where: condition,  order: [
      ['id', 'DESC'],
 
  ]})
    return res.json(message.success("List Of All Expenses-Type", expenses))
  }
  let offset = 0;
  expenses_type.findAndCountAll()
  .then((data) => {
    // let page = req.params.page;      
    const page = parseInt(req.query.page)
    let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1);
        let currentPage = parseInt(page);
        let previousPage = (currentPage <= 1) ? null : (currentPage-1);
        let nextPage = (currentPage>= pages) ? null : (currentPage+1);
       expenses_type.findAll({
        order: [
          ['id', 'DESC'],
     
      ],
        attributes: ['id','expenses_type'],
        limit: limit,
        offset: offset,
        $sort: { id: 1 },
        where: condition})
        .then((expenses_type) =>{ return (!expenses_type) ? res.json(message.failed("This Expenses-Type is Not Found")) : res.json(message.success ("List Of All Expenses-Type",{'count': data.count, 'totalPages': pages, 'perPage' : limit, 'currentPage' : currentPage, 'previousPage': previousPage, 'nextPage' : nextPage, 'result': expenses_type}));
      });
  })
}

// Update a ExpensesType
async function update(req, res) {
  let data = req.body;
  if (!data) {
    return res.json(message.failed("All input  required"));
  }
  let validation = new Validator(data, {
    expenses_type: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let expenses = await expenses_type.findAll({ where: { expenses_type: req.body.expenses_type } });
  if (expenses.length != 0) {
    return res.json(message.failed(" This Expenses-Type is already exists "));
  }
  var type = await expenses_type.update(data, { where: { id: req.query.id } });
  (type != 0) ? res.json(message.success("Expenses-Type updated successfully", data)) : res.json(message.failed("unable to update This Expenses-Type"));
}

// Delete a expenses_type
async function deletex(req, res) {
  const type = await expenses_type.destroy({ where: { id: req.query.id } });
  (type) ? res.json(message.success("Expenses-Type Deleted successfully")) : res.json(message.failed("This Expenses-Type is not exists"));
}

// // Export all Function's
export default {
  create, show, update, deletex
}