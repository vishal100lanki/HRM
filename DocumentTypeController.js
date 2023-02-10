import DocumentType from "../models/DocumentType.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";
import _ from "lodash";


// Create  DocumentType 
async function create(req, res) {
  let data = req.body;
  let validation = new Validator(data, {
    doc_title: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let document = await DocumentType.findAll({ where: { slug: _.snakeCase(req.body.doc_title) } });
  if (document.length != 0) {
    return res.json(message.failed(" This Document Type is already exists "));
  }

  data.slug = _.snakeCase(data.doc_title)

  DocumentType.create(data).then((data) => res.json(message.success(" Document Type Created Successfully", data)))

  }

// Get List of DocumentType
async function show(req, res) {
// Search Filter
const condition = {};
if(req.query.doc_title){ 
  condition.v = req.query.doc_title
}

const limit = parseInt(req.query.limit);
if(!limit){
  const doc_title = await DocumentType.findAll({where: condition,  order: [
    ['id', 'DESC'],

]})
  return res.json(message.success("List Of All doc_title's", doc_title))
}
let offset = 0;
DocumentType.findAndCountAll()
.then((data) => {
  // let page = req.params.page;      
  const page = parseInt(req.query.page)
  let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);  
      let currentPage = parseInt(page);
      let previousPage = (currentPage <= 1) ? null : (currentPage-1);
      let nextPage = (currentPage>= pages) ? null : (currentPage+1);
      DocumentType.findAll({ 
        order: [
          ['id', 'DESC'],
     
      ],
  attributes: ['id','doc_title'],
  limit: limit,
  offset: offset,
  $sort: { id: 1 },
  where: condition})
  .then((doc) =>{ return (!DocumentType) ? res.json(message.failed( " This Document Type is Not Found " )) : res.json(message.success ("List Of Document Type's",{'count': data.count, 'totalPages': pages, 'perPage' : limit, 'currentPage' : currentPage, 'previousPage': previousPage, 'nextPage' : nextPage, 'result': doc}));
});

})

}

// Update a Document Type
async function update(req, res) {
  let data = req.body;
  let validation = new Validator(data, {
    doc_title: 'required',
    
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let doc = await DocumentType.findAll({ where: { doc_title: req.body?.doc_title } });
  if (doc.length != 0) {
    return res.json(message.failed(" This Document Type  is already exists "));
  }

  var document = await DocumentType.update({doc_title: req.body?.doc_title}, { where: { id: req.query.id } });
  return (document != 0) ? res.json(message.success("Document Type  updated successfully", data)) : res.json(message.failed("unable to update this Document"));
}

// Delete a Document
async function deletex(req, res) {
  const document = await DocumentType.destroy({ where: { id: req.query.id } });
  return (document) ? res.json(message.success("Document type Deleted Successfully")) : res.json(message.failed("This Document Type is not exists"));
}

// Export all Function's
export default {
    create,show,update,deletex
  }