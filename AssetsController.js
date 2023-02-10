import Assets from "../models/Assets.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";


// Create  Assets 
async function create(req, res) {
  let data = req.body;
  let validation = new Validator(data, {
    amount: 'required|numeric',
    paid_for: 'required',
    paid_to: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  Assets.create(req.body).then((data) => res.json(message.success("Assets Created Successfully", data)))
    .catch((error) => {
      return res.json(message.failed("unable to create Assets "));
    });
  //   let assets= await Assets.create(req.body);
  // if(assets){
  // return  res.json(message.success("Assets Created Successfully", data));
  // }
  //   // .catch((error) => {

  //   //   return res.json(message.failed("unable to create Assets "));
  //   // });

};

// Get List of Assets
async function show(req, res) {
  
  // Search Filter
  const condition = {};
  if(req.query.amount){ 
    condition.amount=req.query.amount
  }
  if(req.query.paid_for){ 
    condition.paid_for=req.query.paid_for
  }
  if(req.query.from){   
    condition.from=req.query.from
  }
  if(req.query.paid_to){ 
    condition.paid_to=req.query.paid_to
  }

  const limit = parseInt(req.query.limit);
  if(!limit){
    const assets = await Assets.findAll({where: condition,
      order: [
        ['id', 'DESC'],
   
    ]})
    return res.json(message.success("List of All Assets", assets))
  }
  let offset = 0;
  Assets.findAndCountAll()
  .then((data) => {
    // let page = req.params.page;      
    const page = parseInt(req.query.page)
    let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1);
        let currentPage = parseInt(page);
        let previousPage = (currentPage <= 1) ? null : (currentPage-1);
        let nextPage = (currentPage>= pages) ? null : (currentPage+1);
  Assets.findAll({
     attributes: ['id','amount','paid_for','from','paid_to'],
    limit: limit,
    offset: offset,
    $sort: { id: 1 },
    where: condition})
    .then((assets) =>{ return (!assets) ? res.json(message.failed("This Assets is  Not Found")) : res.json(message.success ("List of All Assets",{'count': data.count, 'totalPages': pages, 'perPage' : limit, 'currentPage' : currentPage, 'previousPage': previousPage, 'nextPage' : nextPage, 'result': assets}));
  });
})
}

// Update a Assets
async function update(req, res) {

  let data = req.body;
  let validation = new Validator(data, {
    amount: 'required|numeric',
    paid_for: 'required',
    paid_to: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  var assets = await Assets.update(data, { where: { id: req.query.id } });
  return (assets != 0) ? res.json(message.success("Assets updated successfully", data)) : res.json(message.failed("unable to update Assets"));
}


// Delete a Assets
async function deletex(req, res) {

  const assets = await Assets.destroy({ where: { id: req.query.id } });
  return (assets) ? res.json(message.success("Assets Deleted successfully")) : res.json(message.failed("This Assets is Not Exist"));
}


// Export all Function's
export default {
  create, show, update, deletex
}