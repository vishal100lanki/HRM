import express from "express";
import Validator from "validatorjs";
import InterviewList from "../models/InterviewList.js";
import message from "../../Traits/message.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import {INTERVIEW_STATUS, InterviewStatusKeys} from "../../Traits/interviewStatus.js";
import Designation from "../models/Designation.js";

// Create a new InterviewList
async function create(req, res) {
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res.json(message.failed("All input  required"));
    }
 
    let validation = new Validator(data, {
        user_id:'required',
        designation_id: 'required',
        candidate_id:'required',
        schedule: 'required',
        status: 'required|in:' + InterviewStatusKeys(true),
      
    });

    if (validation.fails()) {
        let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
        return res.json(message.failed(validation.errors.first(err_key)));
    }

    let candidate = await Candidate.findByPk(req.body.candidate_id);
    if (!candidate) {
      return res.json(message.failed("This Candidate is not exist"));
    }

    let designation = await Designation.findByPk(req.body.designation_id);
    if (!designation) {
      return res.json(message.failed("This Designation is not exist"));
    }

    let user = await User.findByPk(req.body.user_id);
    if (!user) {
      return res.json(message.failed("This user is not exist"));
    }

    InterviewList.create(req.body).then((data) => res.json(message.success(" Interview-List Created Successfully ", data)));

   }

// Get List of interviews
async function show(req, res) {
      // Search Filter
const condition = {};
  if (req.query.candidate_id) {
    condition.candidate_id = req.query.candidate_id
  }
  if (req.query.designation_id) {
    condition.designation_id = req.query.designation_id
  }
  if (req.query.user_id) {
    condition.user_id = req.query.user_id
  }

  const limit = parseInt(req.query.limit); 
  if(!limit){
    const designation = await InterviewList.findAll({where: condition,  order: [
      ['id', 'DESC'],
 
  ]})
    return res.json(message.success("List of All Interview-List", designation))
  }
  let offset = 0;
  InterviewList.findAndCountAll()
  .then((data) => {
    const page = parseInt(req.query.page) 
    let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1);
        let currentPage = parseInt(page);
        let previousPage = (currentPage <= 1) ? null : (currentPage-1);
        let nextPage = (currentPage>= pages) ? null : (currentPage+1);
        InterviewList.findAll(
            {  order: [
              ['id', 'DESC'],
         
          ],
              attributes: ['id','user_id', 'designation_id', 'candidate_id','schedule'],
              limit: limit,
              offset: offset,
              $sort: { id: 1 },
              where: condition,
          
              include:
                [{ model: User,attributes: ['name'] },
                { model: Designation,attributes: ['designation_name']},
                { model: Candidate,attributes: ['name']}]
            })
            .then((interview) =>{ return (!interview) ? res.json(message.failed("This Interview-List is Not Found")) : res.json(message.success ("List of All Interview-List",{'count': data.count, 'totalPages': pages, 'perPage' : limit, 'currentPage' : currentPage, 'previousPage': previousPage, 'nextPage' : nextPage, 'result': interview}));
          });
          })
          };


// Update an Interview
async function update(req, res) {
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res.json(message.failed("All input  required"));
    }
 
    let validation = new Validator(data, {
        user_id:'required',
        designation_id: 'required',
        candidate_id:'required',
        schedule: 'required',
        status:'required|in:' + InterviewStatusKeys(true),
      
    });

    if (validation.fails()) {
        let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
        return res.json(message.failed(validation.errors.first(err_key)));
    }

    let candidate = await Candidate.findByPk(req.body.candidate_id);
    if (!candidate) {
      return res.json(message.failed("This Candidate is not exists"));
    }

    let designation = await Designation.findByPk(req.body.designation_id);
    if (!designation) {
      return res.json(message.failed("This Designation is not exist"));
    }
    
    let user = await User.findByPk(req.body.user_id);
    if (!user) {
      return res.json(message.failed("This user is not exists"));
    }
    var users = await InterviewList.update(req.body, { where: { id:req.query.id } })
    return (users != 0) ? res.json(message.success(" Interview-List Updated Successfully", data)) : res.json(message.failed("Unable to Update Interview-List"));
};


// Delete an Interview
async function deletex(req, res) {
    const user = await InterviewList.destroy({ where: { id: req.query.id } });
    return (user) ? res.json(message.success("Interview-List Deleted Successfully")) : res.json(message.failed("This Interview-List is not exists"));
  }
  
export default {
    create,
    show,
    update,
    deletex

}