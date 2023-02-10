import express from "express";
import Candidate from "../models/Candidate.js";
import Validator from "validatorjs";
import User from "../models/User.js";
import message from "../../Traits/message.js";
import { CANDIDATE_STATUS, CandidateStatusKeys } from "../../Traits/candidateStatus.js";
import { Op } from 'sequelize'
import Designation from "../models/Designation.js";
import Role from "../models/Role.js";
import Team from "../models/Team.js";
import bcrypt from "bcryptjs"

async function create(req, res) {
  let request = req.body;

  let flattened = {
    'name': 'required',
    'email': 'required',
    'date_of_birth': 'required',
    'mobile_number': 'required',
    'gender': 'required',
    'current_location': 'required',
    'permanent_address': 'required',
    'marital_status': 'required',
    'do_you_smoke': 'required',
    'do_you_consume_alcohol': 'required',
    'do_you_have_a_police_record': 'required',
    'differently_abled': 'required',
    'have_you_been_interviewed_by_us_in_last_six_month': 'required',
    'do_you_have_a_history_of_any_major_illness': 'required',
    'how_did_you_learn_about_the_opening': 'required',
    'current_position': 'required',
    'edu': "required|array",
    'edu.*.class': 'required|string',
    'edu.*.degree': 'required|string',
    'edu.*.school': 'required|string',
    'edu.*.board_and_university': 'required|string',
    'edu.*.month_and_passing_year': 'required|string',
    'edu.*.attempts': 'required|string',
    'edu.*.percentage_cgpa': 'required|max:99.99|string',
    'current_organisation': 'required_if:current_position,experienced',
    'current_designation': 'required_if:current_position,experienced',
    'total_experience': 'required_if:current_position,experienced',
    'fixed_salary': 'required_if:current_position,experienced',
    'bonus_incentive': 'required_if:current_position,experienced',
    'total_salary': 'required_if:current_position,experienced',
    'expected_salary': 'required_if:current_position,experienced',
    'notice_period': 'required_if:current_position,experienced',
    'workTrainee': "required|array",
    'workTrainee.*.from': 'required_if:current_position,experienced|required_if:current_position,trainee|string',
    'workTrainee.*.to': 'required_if:current_position,experienced|required_if:current_position,trainee|string',
    'workTrainee.*.organisation': 'required_if:current_position,experienced|required_if:current_position,trainee|string',
    'workTrainee.*.designation': 'required_if:current_position,experienced|string',
    'workTrainee.*.reason_of_leaving': 'required_if:current_position,experienced|string',
    'workTrainee.*.technologies': 'required_if:current_position,experienced|required_if:current_position,trainee|string',
    'designation_id': 'required',


  };


  if (Object.keys(request).length == 0) {
    return res.json(message.failed("All input  required"));
  }
  let validation = new Validator(request, flattened);


  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));


  }

  let exist = await Candidate.findAll({ where: { email: req.body.email } })

  if (exist.length != 0) {

    return res.json(message.failed("This Email is already exist"));
  }

  let designation = await Designation.findByPk(req.body.designation_id);
  if (!designation) {
    return res.json(message.failed("This Designation is not exist"));
  }
  // return res.json({request})

  Candidate.create(request).then((candidate) => res.json(message.success("Candidate Created Successfully", candidate)));
}

// Get List of User 
async function show(req, res) {

  // Search Filter
  const condition = { is_transfer: 0 };
  if (req.query.id) {
    condition.id = req.query.id
  }
  if (req.query.full_name) {
    condition.full_name = req.query.full_name
  }

  if (req.query.designation_id) {
    condition.designation_id = req.query.designation_id
  }
  if (req.query.email) {
    condition.email = req.query.email
  }

  const limit = parseInt(req.query.limit);
  if (!limit) {
    const candidates = await Candidate.findAll({
      where: condition, order: [
        ['id', 'DESC'],

      ], include: [
        {
          model: Designation,
          attributes: ['id', 'designation_name']
        }],
    })
    return res.json(message.success("List of All Candidates", candidates))
  }
  let offset = 0;
  Candidate.findAndCountAll()
    .then((data) => {
      const page = parseInt(req.query.page)
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      let currentPage = parseInt(page)
        ;
      let previousPage = (currentPage <= 1) ? currentPage : (currentPage - 1);
      let nextPage = (currentPage >= pages) ? null : (currentPage + 1);

      Candidate.findAll(
        {
          order: [
            ['id', 'DESC'],

          ],
          limit: limit,
          offset: offset,
          $sort: { id: 1 },
          where: condition, order: [
            ['id', 'DESC'],
          ],
          include: [
            {
              model: Designation,
              attributes: ['id', 'designation_name']
            }],
        })
        .then((candidate) => {
          return (!candidate) ? res.json(message.failed("This Candidate is Not Found")) : res.json(message.success("List of All Candidates", { 'count': data.count, 'pages': pages, 'currentPage': currentPage, 'previousPage': previousPage, 'nextPage': nextPage, 'result': candidate }));
        });



    })

};

// Update User
async function update(req, res) {
  let request = req.body;

  let validation = new Validator(request, {
    candidate_id: 'required',
    status: 'required',

  })


  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let candidate_id = await Candidate.findByPk(request.candidate_id);
  // return res.send({candidate_id})
  if (!candidate_id) {
    return res.json(message.failed("Invalid Data!!"));

  }

  let is_transfer = request.status == "transfered" ? 1 : 0;


  let candidate = await Candidate.update({
    status: request.status,
    is_transfer
  },
    {
      where:
      {
        id: request.candidate_id
      }
    });

  // return  res.json({candidate})
  // return  res.json(message.success("Candidate Status Updated Successfully"))

  return (candidate != 0) ? res.json(message.success("Candidate Status Updated Successfully")) : res.json(message.failed("Unable to Update Candidate Status"));
}

// Delete User 
async function deletex(req, res) {
  const candidate = await Candidate.destroy({ where: { id: req.query.id } });
  return (candidate) ? res.json(message.success("Candidate Deleted Successfully")) : res.json(message.failed("This Candidate is not Exist "));
}

// Transfer To User
async function transfer(req, res) {
  let data = req.body;

  let validation = new Validator(data, {
    candidate_id: 'required',
    role_id: 'required',
    designation_id: 'required',
    team_id: 'required',
  })


  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let candidate = await Candidate.findByPk(data.candidate_id);
  // return res.send(candidate)
  if (!candidate) {
    return res.json(message.failed("This Candidate is not exist"));

  }

  let candidates = await User.findAll({ where: { candidate_id: data.candidate_id } })
  
  if (candidates.length != 0) { // Check id(exist or not)  
    return res.json(message.failed("This Candidate is already transferd"));
  }



  let role = await Role.findByPk(data.role_id);
  if (!role) {
    return res.json(message.failed("This Role is not exist"));

  }
  let designation = await Designation.findByPk(data.designation_id);
  if (!designation) {
    return res.json(message.failed("This Designation is not exist"));

  }
  let team = await Team.findByPk(data.team_id);
  if (!team) {
    return res.json(message.failed("This Team is not exist"));

  }

  
    let user = {
      candidate_id: data.candidate_id,
      name: candidate.name,
      email: candidate.email,
      gender: candidate.gender,
      date_of_birth: candidate.date_of_birth,
      role_id: data.role_id,
      designation_id: data.designation_id,
      team_id: data.team_id,
    }
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash("123456789", salt);
    var users = await User.create(user);
    // User.create(user).then((data) => res.json(message.success(" User Created Successfully", user))).catch((e) => res.json(message.success(" error", e)));
    if(users){
      candidate.status = "transfered";
      candidate.is_transfer = candidate.status == "transfered" ? 1 : 0;
      await candidate.save(); 
  
    }
    return (users != 0) ? res.json(message.success(" User Created Successfully", user)) : res.json(message.failed("Unable to Create User"));

  
}

// Fetch data
async function fetch(req, res) {

  let condition = [];

  if (req?.query?.mobile_number) {
    condition.push({ mobile_number: req?.query?.mobile_number })
  }

  if (req?.query?.email) {
    condition.push({ email: req?.query?.email })
  }



  try {
    let result = await Candidate.findAll({
      where: { [Op.or]: condition }
    });
    return res.json(result);
  }
  catch (error) {
    return res.json({ error });
  }
}

export default {
  create,
  show,
  update,
  transfer,
  deletex,
  fetch
 }







