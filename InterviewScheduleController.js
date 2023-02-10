import express from "express";
import Validator from "validatorjs";
import Interview from "../models/InterviewReview.js";
import message from "../../Traits/message.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import moment from "moment";
import _ from "lodash";
import InterviewRound from "../models/InterviewRound.js";
import InterviewSchedule from "../models/Interview_schedule.js";
import validateDate from "validate-date";
import { Op, where } from "sequelize";


// Create a new Interview
async function create(req, res) {
  let data = req.body;
  let validation = new Validator(data, {

    user_id: 'required',
    candidate_id: 'required',
    interview_type: 'required',
    interview_round_id: 'required',
    interview_timing: 'required',
    interview_date: 'required', //yyyy-mm-dd    
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let candidate = await Candidate.findByPk(req.body.candidate_id);
  if (!candidate) {
    return res.json(message.failed("This Candidate is not exists"));
  }

  let user = await User.findByPk(req.body.user_id);
  if (!user) {
    return res.json(message.failed(" This user is not exists "));
  }
  let interview_round = await InterviewRound.findByPk(req.body.interview_round_id);
  if (!interview_round) {
    return res.json(message.failed(" This interview round  is not exists "));
  }

  if (req.body.interview_timing) {
    let check2 = moment(req.body.interview_timing, 'HH:mm:ss', true).isValid();
    if (check2 == false) {
      return res.json(message.failed("Invalid interview time formate"));
    }
  }


  if (req.body.interview_date) {
    let check = validateDate(req.body.interview_date, 'boolean');
    if (check == false) {
      return res.json(message.failed("Invalid In Time Date formate"));
    }
  }

  let att = await InterviewSchedule.findOne({
    where: { "candidate_id": data.candidate_id }
  });

  if (att) {
    return res.json(message.failed(" Interview is  already Schedule for this user."));
  }
  var interview_schedule = await InterviewSchedule.create(data);

  // InterviewSchedule.create(req.body).then((data) => res.json(message.success(" Interview Created Successfully", data)));
  if (interview_schedule) {
    // Candidate.findOne({where:{candidate_id:data.candidate_id}})
    candidate.status = "assigned";
    await candidate.save();

  }
  return (interview_schedule) ? res.json(message.success("Interview Schedule Successfully")) : res.json(message.failed("Unable to Schedule"));
}

// Get List of interviews
async function show(req, res) {
  // Search Filter
  const condition = {};

  if (req.query.name) {
    condition['$Candidates.name$'] = { [Op.like]: req.query.name };
  }

  if (req.query.interview_round_id) {
    condition.interview_round_id = req.query.interview_round_id
  }

  if (req.query.candidate_id) {
    condition.candidate_id = req.query.candidate_id
  }


  if (req.query.user_id) {
    condition.user_id = req.query.user_id
  }


  const limit = parseInt(req.query.limit);
  if (!limit) {
    try {

      var interview_round = await InterviewSchedule.findAll({
        order: [
          ['id', 'DESC'],
        ],
        where: condition,
        include:
          [{ model: User, as: 'Users', attributes: ['name'] },
          { model: Candidate, as: 'Candidates', attributes: ['name'] },
          { model: InterviewRound, attributes: ['interview_round'] }]
      })
      interview_round = interview_round.map((el) => {
        el.newdata = new Date(el.interview_date + ' ' + el.interview_timing).getTime()

        return el;
      });

      interview_round = _.orderBy(interview_round, ['newdata'], ['desc']);
      return res.json(message.success("List Of All Interview-Schedule's", interview_round))
    }

    catch (error) {

      return res.json(message.success("unable to fetch at this time"));

    }

  }
  let offset = 0;
  InterviewSchedule.findAndCountAll()
    .then(async (data) => {
      const page = parseInt(req.query.page)
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      let currentPage = parseInt(page);
      let previousPage = (currentPage <= 1) ? null : (currentPage - 1);
      let nextPage = (currentPage >= pages) ? null : (currentPage + 1);
      let interview_round = await InterviewSchedule.findAll({
        order: [
          ['id', 'DESC'],
        ],
        where: condition,
        include:
          [{ model: User, as: 'Users', attributes: ['name'] },
          { model: Candidate, as: 'Candidates', attributes: ['name'] },
          { model: InterviewRound, attributes: ['interview_round'] }],
        limit: limit,
        offset: offset,
        $sort: { id: 1 },
      })

      interview_round = interview_round.map((el) => {
        el.newdata = new Date(el.interview_date + ' ' + el.interview_timing).getTime()
        return el;
      });

      interview_round = _.orderBy(interview_round, ['newdata'], ['desc']);

      return res.json(message.success("List Of All Interview-Schedule's", { 'count': data.count, 'totalPages': pages, 'perPage': limit, 'currentPage': currentPage, 'previousPage': previousPage, 'nextPage': nextPage, interview_round }));
    }

    )
};

// Update an Interview
async function update(req, res) {
  let data = req.body;
  let validation = new Validator(data, {
    user_id: 'required',
    candidate_id: 'required',
    interview_type: 'required',
    interview_round_id: 'required',
    interview_timing: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let candidate = await Candidate.findByPk(req.body.candidate_id);
  if (!candidate) {
    return res.json(message.failed("This Candidate is not exists"));
  }

  let user = await User.findByPk(req.body.user_id);
  if (!user) {
    return res.json(message.failed(" This user is not exists "));
  }
  let interview_round = await InterviewRound.findByPk(req.body.interview_round_id);
  if (!interview_round) {
    return res.json(message.failed(" This interview round  is not exists "));
  }

  if (req.body.interview_timing) {
    let check2 = moment(req.body.interview_timing, 'HH:mm:ss', true).isValid();
    if (check2 == false) {
      return res.json(message.failed("Invalid interview time formate"));
    }
  }
  var interview = await InterviewSchedule.update(req.body, { where: { id: req.query.id } })
  return (interview != 0) ? res.json(message.success(" Interview schedule Updated Successfully ", data)) : res.json(message.failed("Unable to Update Interview schedule"));
};

// Interview Reschedule
async function reschedule(req, res) {
  var request = req.body;

  var new_data;
  try {
    let existing_data = await InterviewSchedule.findByPk(req.params.id);
    var id = existing_data.user_id;
    var cand_id = existing_data.candidate_id;

    console.log({ id, cand_id });
    var data = {
      user_id: id,
      candidate_id: cand_id,
      interview_type: request.interview_type,
      interview_round_id: request.interview_round_id,
      interview_timing: request.interview_timing,
      interview_date: request.interview_date,
      
    }
        new_data = await InterviewSchedule.create(data);
  
  if(new_data){
  var data = await InterviewSchedule.update({
    status: 'cancelled',
    resion: 'Reschedule - ' + request.resion
  }, {
    where: {
      id: req.params.id
    }
  });
  }
  return res.json(message.success(" Interview Rescheduled Successfully ", new_data));}
  catch (error) {
      console.log({error});
      return res.json(message.success("Error Portion", error))
    }

}

// Delete an Interview
async function deletex(req, res) {
  const user = await Interview.destroy({ where: { id: req.query.id } });
  return (user) ? res.json(message.success(" Interview Deleted Successfully ")) : res.json(message.failed("This Interview is not exists"));
}

// // Get All Interview-List
// async function interviewDetail(req, res) {

//   let candidate_id = await InterviewSchedule.findAll({ where: {'candidate_id' : req.params.id, status:"scheduled" },
//   include:[{model: Interview, as:'Interview_id',attributes:["culture_fitment"] }]});
// return res.send(candidate_id);
//    if (!candidate_id) {
//     return res.json(message.failed("This Candidate id is not exists"));
//    }


//   //  let InterviewReview = await Interview.findAll({ where: {'candidate_id' : req.params.id } });

//   //  if (!InterviewReview) {
//   //   return res.json(message.failed("This InterviewReview id is not exists"));
//   //  }




// }


//get interview-sd Candidate
// async function getScheduled(req, res){
//   let candidate_id = await InterviewSchedule.findAll({ where: { status:"scheduled" },
//   include:[{
//     model:InterviewSchedule, as:'Interview_id' 
//     }]});
//   return res.send(candidate_id);
// }

export default {
  create,
  show,
  update,
  deletex,
  reschedule
}
