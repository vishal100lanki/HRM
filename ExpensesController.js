import Expenses from "../models/Expenses.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";
import ExpensesType from "../models/ExpensesType.js";

// Create  Expenses 
async function create(req, res) {
  let data = req.body;
  data.billing_image = req.file.filename;
  // return res.send(data.billing_image);
  
  let validation = new Validator(data, {
    name: 'required',
    expenses_type_id: 'required',
    amount: 'required|numeric',
    billing_image: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let expenses_type = await ExpensesType.findByPk(req.body.expenses_type_id);
  if (!expenses_type) {
    return res.json(message.failed("This Expenses is not exists"));
  }

  Expenses.create(req.body).then((data) => res.json(message.success("Expenses Created Successfully", data)))
};

// Get List of Expenses
async function show(req, res) {

   // Search Filter
   const condition = {};
 
   if(req.query.expenses_type_id){ 
    condition.expenses_type_id=req.query.expenses_type_id
  }
  if(req.query.name){ 
    condition.name=req.query.name
  }
  if(req.query.amount){ 
    condition.amount=req.query.amount
  }

   const limit = parseInt(req.query.limit);
   if(!limit){
    const expenses = await Expenses.findAll({where: condition,  order: [
      ['id', 'DESC'],
 
  ]})
    return res.json(message.success("List of All Expenses", expenses))
  }
   let offset = 0;
   Expenses.findAndCountAll()
   .then((data) => {
     // let page = req.params.page;      
     const page = parseInt(req.query.page)
     let pages = Math.ceil(data.count / limit);
         offset = limit * (page - 1);
         let currentPage = parseInt(page);
         let previousPage = (currentPage <= 1) ? null : (currentPage-1);
         let nextPage = (currentPage>= pages) ? null : (currentPage+1);
      Expenses.findAll({
        order: [
          ['id', 'DESC'],
     
      ],
    attributes: ['id','name','expenses_type_id','amount','billing_image'],
    limit: limit,
    offset: offset,
    $sort: { id: 1 },
    where: condition,
    include:
      [{ model: ExpensesType, attributes: ['expenses_type'] }]
  })

  .then((expenses) =>{ return (!expenses) ? res.json(message.failed("This Expenses is Not Found")) : res.json(message.success ("List of All Expenses",{'count': data.count, 'totalPages': pages, 'perPage' : limit, 'currentPage' : currentPage, 'previousPage': previousPage, 'nextPage' : nextPage, 'result': expenses}));
});
})
}


// Update a Expenses
async function update(req, res) {
 
  let data = req.body;
  data.billing_image = req.file.filename;
  if (!data) {
    return res.json(message.failed("All input required"));
  }

  let validation = new Validator(data, {
    name: 'required',
    expenses_type_id: 'required',
    amount: 'required|numeric',
    billing_image: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let expenses_type = await ExpensesType.findByPk(req.body.expenses_type_id);
  if (!expenses_type) {
    return res.json(message.failed("This Expenses is Alrdy Exist"));
  }
  var expenses = await Expenses.update(data, { where: { id: req.query.id } });
  (expenses != 0) ? res.json(message.success("Expenses updated successfully", data)) : res.json(message.failed("unable to update This Expenses"));
}

// Delete a Expenses
async function deletex(req, res) {
  const expenses = await Expenses.destroy({ where: { id: req.query.id } });
  (expenses) ? res.json(message.success("Expenses Deleted successfully")) : res.json(message.failed("This Expenses is Not Exist"));
}


// Export all Function's
export default {
  create, show, update, deletex
}
