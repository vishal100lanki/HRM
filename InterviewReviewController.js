import Validator from "validatorjs";
import message from "../../Traits/message.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import _ from "lodash";
import { Op } from 'sequelize'
import InterviewSchedule from "../models/Interview_schedule.js";
import InterviewReview from "../models/InterviewReview.js";
import InterviewRound from "../models/InterviewRound.js";





// Create a new Interview
async function create(req, res) {
  let data = req.body;

  let validation = new Validator(data, {
    interview_schedule_id: 'required',
    culture_fitment: 'required',
    technical_skills: 'required',
    overall_ranking: 'required',
    salary: 'required',
    relevant_job_experience: 'required',
    interpersonal_skills: 'required',
    education: 'required',
    supervisory_experience: 'required',
    motivation: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }


  let interview_schedule_id = await InterviewSchedule.findByPk(req.body.interview_schedule_id);
  if (!interview_schedule_id) {
    return res.json(message.failed( " This interview_schedule_id is not exists " ));
  }
// let candidate_id = i.n0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0terview_schedule_id.candidate_id;

// try{
//  let att = await InterviewReview.findOne({
//     where: { "candidate_id": candidate_id}
//   });
//   return res.json(att)
//   // if (att) {
//   //   return res.json(message.failed(" Already Done "));
//   // } 
// }catch(err)
// {
//   return console.log(err);
// }


let Review = await  InterviewReview.create(req.body);
  if(Review){
    interview_schedule_id.status = "done";
    await interview_schedule_id.save(); 
  }
  return res.json(message.success( " Interview Created Successfully " , Review));
}

// Get List of interviews
async function show(req, res) {

  // Search Filter
  const condition = {};
  if (req.query.interview_schedule_id) {
    condition.interview_schedule_id = req.query.interview_schedule_id
  }
  
  const limit = parseInt(req.query.limit);
  if (!limit) {
    const interview_review = await InterviewReview.findAll({
      where: condition, order: [
        ['id', 'DESC'],

      ]
    })
    return res.json(message.success("List Of All Interview Review's", interview_review))
  }
  let offset = 0;
  InterviewReview.findAndCountAll()
    .then((data) => {
      // let page = req.params.page;      
      const page = parseInt(req.query.page)
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      let currentPage = parseInt(page);
      let previousPage = (currentPage <= 1) ? null : (currentPage - 1);
      let nextPage = (currentPage >= pages) ? null : (currentPage + 1);
      InterviewReview.findAll({
        order: [
          ['id', 'DESC']
        ],
        
        limit: limit,
        offset: offset,
        $sort: { id: 1 },
        where: condition,
        // include:
        // [{ model: User, as: 'Users', attributes: ['name'] },
        //   { model: Candidate, as: 'Candidates', attributes: ['name'] }]
      })


        .then((review) => {
          return (!review) ? res.json(message.failed("This Interview Review is Not Found")) : res.json(message.success("List Of Interview Review's", { 'count': data.count, 'totalPages': pages, 'perPage': limit, 'currentPage': currentPage, 'previousPage': previousPage, 'nextPage': nextPage, 'result': review }));
        });

    })
    }
 
// Update an Interview
// async function update(req, res) {
//   let data = req.body;
//   if (Object.keys(data).length == 0) {
//     return res.json(message.failed("All input  required"));
//   }

//   let validation = new Validator(data, {

//     user_id: 'required',
//   candidate_id: 'required',
//     culture_fitment: 'required',
//     technical_skills: 'required',
//     overall_ranking: 'required',
//     salary: 'required',
//     relevant_job_experience: 'required',
//     interpersonal_skills: 'required',
//     education: 'required',
//     supervisory_experience: 'required',
//     motivation: 'required',
//   });

//   if (validation.fails()) {
//     let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
//     return res.json(message.failed(validation.errors.first(err_key)));
//   }

//   // let candidate = await Candidate.findByPk(req.body.candidate_id);
//   // if (!candidate) {
//   //   return res.json(message.failed( " This Candidate is not exists " ));
//   // }

                                           

//   // let user = await User.findByPk(req.body.user_id);
//   // if (!user) {
//   //   return res.json(message.failed( " This user is not exists " ));
//   // }

//   var users = await Interview.update(req.body, { where: { id: req.query.id } })
//   return (users != 0) ? res.json(message.success(" Interview Updated Successfully ", data)) : res.json(message.failed("Unable to Update Interview"));
// };


// Delete an Interview
// async function deletex(req, res) {
//   const user = await Interview.destroy({ where: { id: req.query.id } });
//   return (user) ? res.json(message.success(" Interview Deleted Successfully")) : res.json(message.failed("This Interview is not exists"));
// }
 
// Get interview-sd Candidate
async function getScheduled(req, res){
  let candidate_id = await InterviewSchedule.findAll({ where: { status:"scheduled" },
    defaultScope: {
    attributes: {exclude:['user_id']}
    },
  include:[{
    model:Candidate , as :'Candidates', attributes: ['name']
    }]});
  return res.send(candidate_id);
}


// Get All Interview-List 
async function interviewDetail(req, res) {
  //interview
  try {

    let interview_schedule = await InterviewSchedule.findAll({ where: {'candidate_id' : req.params.id} 
    , include: [{ model: InterviewReview},
     { model: User, as: 'Users', attributes: ['name'] },
          { model: Candidate, as: 'Candidates', attributes: ['name'] },
          { model: InterviewRound, attributes: ['interview_round'] }
          ]
  });

return res.json({interview_schedule});
  } catch (error) {
    console.log(error);
    return res.json(error);

    
  }
}

//Export 
export default {
  create,
  show,
  // update,
  // deletex,
  interviewDetail,
  getScheduled
}
