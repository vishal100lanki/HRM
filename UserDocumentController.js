import DocumentType from "../models/DocumentType.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";
import User from "../models/User.js";
import Candidate from "../models/Candidate.js";
import fs from "fs";
import _ from "lodash";
import { UserDocumentModel } from '../models/main.js';

// Image Upload 
async function imageupload(req, res) {

  let id = req.user.id
  let candidate_id = await Candidate.findByPk(req.params.id);
  if (!candidate_id) {
    // fs.unlinkSync('http://192.168.11.127:3000/uploads/');
    return res.json(message.failed("This Candidate id is not exists"));
  }

  let paths = [];
  var msg = "";
  _.forEach(req.files, async (value) => {
    let v = value[0];
    let d = {
      slug: v.fieldname,
      path: v.destination + v.filename
    }
    paths.push(d);
    let datas = {
      user_id: id,
      candidate_id: candidate_id.id,
      document_type_slug: d.slug,
      document_path: d.path,
    }
    // console.log("datas", datas);

    let foundItem = await UserDocumentModel.findOne({ where: { candidate_id: req.params.id, document_type_slug: datas.document_type_slug } });
    
    
    if (_.isEmpty(foundItem)) {
      let item = await UserDocumentModel.create(datas)
      msg = item ? res.json(message.success("document Created Successfully", item)) : "failed to create document ";
    }
    else {
      let item = await UserDocumentModel.update(datas, { where: { candidate_id: req.params.id, document_type_slug: datas.document_type_slug } });

      msg = item ? res.json(message.success("document Updated Successfully")) : "failed to update document";
    }
  })
  return msg;

}

// Get Documents
async function show(req, res) {

  let candidate_id = await Candidate.findByPk(req.params.id);

  if (!candidate_id) {
    return res.json(message.failed("This Candidate id is not exists"));
  }

  let candidate_docs = await UserDocumentModel.findAll({ where: { candidate_id: req.params.id } });
  let types = await DocumentType.findAll();
  // return res.send(candidate_docs[0].id)
  let resulted = [];


  types.forEach((type) => {

    let finded = candidate_docs.find(el => el.document_type_slug == type.slug);

    let data = {
      user_document_id: finded?.id || "",
      document_title: type.doc_title,
      document_slug: type.slug,
      document_path: finded?.document_path || "",
    }

    resulted.push(data)

  });



  return (resulted) ? res.json(message.success("Candidate Document Fetched Succesfully!!", resulted)) : res.json(message.failed("Unable to Fetch at this time."));
}

// Delete a User Document
async function deletex(req, res) {
  const document = await UserDocumentModel.destroy({ where: { id: req.query.id } });
  return (document) ? res.json(message.success("User Document Deleted Successfully")) : res.json(message.failed("This User Document is not exists"));
}


// View 



async function view(req, res) {
 let user_document_id = await UserDocumentModel.findByPk(req.params.id);

  if (!user_document_id) {
    return res.json(message.failed("This user document id  is not exists"));
  }

  // let user_document = await UserDocumentModel.findAll({ where: { user_document_id: req.params.id } });


return res.send(user_document_id);
}

// Export all Function's
export default {
  imageupload, deletex, show,view
}
