import User from "../models/User.js";
import Token from "../models/Token.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";
import Role from "../models/Role.js";
import Reset from "../models/ResetPassword.js";
import Team from "../models/Team.js";
import crypto from "crypto";
import Mail from "../../Traits/Mail.js";
import { send } from "process";
import moment from "moment";
import Designation from "../models/Designation.js";


function makeid() {
  return crypto.randomBytes(20).toString('hex');
}

// Create User
async function create(req, res) {
  let data = req.body;
  let validation = new Validator(data, {

    name: 'required',
    email: 'required|email',
    password: 'required|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/',
    date_of_birth: 'required',
    gender: 'required',
    role_id: 'required',
    designation_id: 'required',
    team_id: 'required',

  });

  if (validation.fails()){ // Validation - Error's 
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let user = await User.findAll({ where: { email: req.body.email } })
  if (user.length != 0) { // Check email(exist or not)  
    return res.json(message.failed("This Email is already exist"));
  }

  let role = await Role.findByPk(req.body.role_id);
  if (!role) { // Find Role in Role Model
    return res.json(message.failed("This role is not exist"));
  }

  let designation = await Designation.findByPk(req.body.designation_id);
  if (!designation) {
    return res.json(message.failed("This Designation Id is not exist"));
  }

  let team = await Team.findByPk(req.body.team_id);
  if (!team) {
    return res.json(message.failed("This Team is not exist"));
  }

  data.password = bcrypt.hashSync(data.password);
  User.create(req.body).then((data) => res.json(message.success("User Created Successfully", data)));

};

// User Login
async function login(req, res) {

  let data = req.body
  let validation = new Validator(data, {
    email: 'required|email',
    password: 'required',

  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let user = await User.findOne({
    where: { email: data.email },
    attributes: ['id', 'name', 'gender' , 'email', 'password', 'date_of_birth', 'role_id', 'designation_id', 'team_id'],
    include:
      [{ model: Role, attributes: ['role_name'] },
      { model: Designation, attributes: ['designation_name'] },
      { model: Team, attributes: ['team_name'] }],

  });


  if (!user) {
    return res.json(message.failed(" You are not verified!! "))
  }

  const passwordIsvalid = bcrypt.compareSync(data.password, user.password);
  if (!passwordIsvalid) {
    return res.json(message.failed("Password Incorrect"));
  }

  var token_id = makeid();
  let token = jwt.sign({ "user_id": user.id, "tid": token_id }, 'thisismyprivatekeyforUsertoverify', { expiresIn: "1h" });
  await Token.create({ token_id, user_id: user.id })

  delete user.dataValues.password;
  return res.json(message.success("LogIn Successfully", { user, token: token }));
};

//  Get user 
async function show(req, res) {
  // Search Filter
  const condition = {};
  if (req.query.id) {
    condition.id = req.query.id
  }
  if (req.query.name) {
    condition.name = req.query.name
  }
  if (req.query.gender) {
    condition.gender = req.query.gender
  }
  if (req.query.team_id) {
    condition.team_id = req.query.team_id
  }
  if (req.query.designation_id) {
    condition.designation_id = req.query.designation_id
  }
  if (req.query.role_id) {
    condition.role_id = req.query.role_id
  }
  if (req.query.email) {
    condition.email = req.query.email
  }

  // let limit = 3;   
  const limit = parseInt(req.query.limit);
  if (!limit) {
    const users = await User.findAll({where: condition,
      order: [
        ['id', 'DESC'],
   
    ],
      attributes: ['id', 'name', 'gender', 'email', 'date_of_birth', 'role_id', 'designation_id', 'team_id'],
      include:
        [{ model: Role, attributes: ['role_name'] },
        { model: Designation, attributes: ['designation_name'] },
        { model: Team, attributes: ['team_name'] }]
    })
    return res.json(message.success("All Users", users))
  }

  let offset = 0;
  User.findAndCountAll()
    .then((data) => {
      // let page = req.params.page;      
      const page = parseInt(req.query.page)
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      let currentPage = parseInt(page);
      let previousPage = (currentPage <= 1) ? null : (currentPage - 1);//
      let nextPage = (currentPage >= pages) ? null : (currentPage + 1);
      User.findAll(
        {
          order: [
            ['id', 'DESC'],
       
        ],
          attributes: ['id', 'name', 'gender', 'email', 'date_of_birth', 'role_id', 'designation_id', 'team_id'],
          limit: limit,
          offset: offset,
          $sort: { id: 1 },
          where: condition,

          include:
            [{ model: Role, attributes: ['role_name'] },
            { model: Designation, attributes: ['designation_name'] },
            { model: Team, attributes: ['team_name'] }]
        })
        .then((user) => {
          return (!user) ? res.json(message.failed("User Not Found")) : res.json(message.success("paginated data", { 'count': data.count, 'totalPages': pages, 'perPage': limit, 'currentPage': currentPage, 'previousPage': previousPage, 'nextPage': nextPage, 'result': user }));
        });
    })
};

//Get Profile
async function profile_show(req, res) {
  let user_id = req.user.id;
  let user_info = await User.findByPk(user_id, {
    attributes: ['name', 'gender', 'date_of_birth']
  });
  return res.json(message.success("Login User's Profile", { user_info }));
}

// Update User
async function update(req, res) {
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json(message.failed("All input required"));
  }
  let validation = new Validator(data, {
    name: 'required',
    email: 'required|email',
    date_of_birth: 'required',
    gender: 'required',
    role_id: 'required',
    designation_id: 'required',
    team_id: 'required',

  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let email = await User.findAll({ where: { email: req.user.email } })

  if (email.length != 0) {
    let role = await Role.findByPk(req.body.role_id);
    if (!role) {
      return res.json(message.failed("This role is not exist"));
    }

    let designation = await Designation.findByPk(req.body.designation_id);
    if (!designation) {
      return res.json(message.failed("This Designation is not exist"));
    }

    let team = await Team.findByPk(req.body.team_id);
    if (!team) {
      return res.json(message.failed("This Team is not exist"));
    }

  }
  else {
    let exist = await User.findAll({ where: { email: req.body.email } })

    if (exist.length != 0) {

      return res.json(message.failed("This email is already exist"));
    }

  }

  let user = await User.update({
  name:data.name,
  email:data.email,
  date_of_birth:data.date_of_birth,
  gender:data.gender,
  role_id:data.role_id,
  designation_id:data.designation_id,
  team_id:data.team_id,

  },{where:{
    id: req.query.id
  }});

  
 
  return (user != 0) ? res.json(message.success("User Updated Successfully", data)) : res.json(message.failed("Unable to Update Usre"));
}

// Delete User
async function deletex(req, res) {
  const user = await User.destroy({ where: { id: req.query.id } });
  return (user) ? res.json(message.success("User Deleted Successfully")) : res.json(message.failed("This user is not Exist"));
}

// Send Mail OTP
async function sendMail(req, res, next) {
  let data = req.body;
  let validation = new Validator(data, {
    email: 'required|email',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let user = await User.findOne({ where: { email: data.email } });
  if (!user) {
    return res.json(message.failed(" You are not verified!! "))
  }

  let otp = Math.floor((100000 + Math.random() * 900000));
  // var oldDateObj = new Date();
  // var newDateObj = new Date();
  // newDateObj.setTime(oldDateObj.getTime() + (5 * 60000));
  // var x = new Date(newDateObj + 'GMT');
  // timestamp // 
  let today = new Date();  
  var timeStamp = ( moment(today ).unix() )*1000 +(5*60000);
 
  var email = data.email;

  data = {
    otp: otp,
    expired_at: timeStamp
  }
 let current_time =( moment(today ).unix() )*1000;

  if (current_time < user.expired_at) {
    return res.json(message.failed("Your previous otp is not expired yet"))
  }
 
  await User.update(data, { where: { email: email } });
  Mail.send(email, "" + data.otp);
  return res.json(message.success("Mail has sent on your mail id", { expired_at: data.expired_at }))

}

// Resend OTP
async function resendOtp(req, res, next) {
  let data = req.body;
  let validation = new Validator(data, {
    email: 'required|email',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let user = await User.findOne({ where: { email: data.email } });
  if (!user) {
    return res.json(message.failed(" You are not verified!! "))
  }

  let otp = Math.floor((100000 + Math.random() * 900000));
  let today = new Date();  
  var timeStamp = ( moment(today ).unix() )*1000 +(5*60000);
  // var time = moment(timeStamp).format("hh:mm:ss");
  var email = data.email;

  data = {
    otp: otp,
    expired_at: timeStamp
  }
 let current_time =( moment(today ).unix() )*1000;

  if (current_time < user.expired_at) {
    return res.json(message.failed("Your previous otp is not expired yet"))
  }
 
  await User.update(data, { where: { email: email } });
  Mail.send(email, "" + data.otp);
  return res.json(message.success("Mail has sent on your mail id", { expired_at: data.expired_at }))

}

// Forget Password 
async function forgetPassword(req, res) {
  let data = req.body;
  let validation = new Validator(data, {
    otp: 'required',
    email: 'required|email',
    new_password: 'required|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/|same:confirm_password',
  });
  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }
  let user = await User.findOne({ where: { otp:req.body.otp } });


  if (!user) {
    return res.json(message.failed("This otp is invalid"));
  }
  let email = await User.findOne({ where: { email: data.email } });
  if (!email) {
    return res.json(message.failed(" You are not verified!! "))
  } 
  // var email = data.email;
  // let user = await User.findOne({ where: { id: otp.user_id } });
  let new_password = bcrypt.hashSync(data.new_password);
  let reset_password = await User.update({ password: new_password }, { where: { id: user.id } });
  if (reset_password) {
    var otp = await User.update({ otp: null, expired_at: null }, { where: { id: user.id } })
  }
  // return res.send({reset_password})
  if (otp) {
    await Token.destroy({ where: { user_id:user.id } })
    return res.json(message.success("Password Forget Successfully"));
  }else{
    return res.json(message.failed("unable to update"));
  }

}

// Change Password
async function changePassword(req, res) {
  let data = req.body;
  
  let validation = new Validator(data, {
    old_password: 'required',
    new_password: 'required|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/|same:confirm_password',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let user = await User.findByPk(req.user.id);

  // IF USER NOT FOUND
  if (!user) {
    return res.json(message.failed("Invalid Data!!"));
  }

  const password = bcrypt.compareSync(data.old_password, user.password);

  // IF PASSWORD INCORRECT
  if (!password) {
    return res.json(message.failed("Old Password is Incorrect"));
  }

  
  try {

    user.password = bcrypt.hashSync(data.new_password);

    let updated = user.save();

    if (updated) {
      await Token.destroy({ where: { user_id: req.user.id } })
      return res.json(message.success("Password Updated Successfully"));
    }

  } catch (error) {
    res.json(message.failed(error))
  }
}

// LogOut From All Devices 
async function hardLogout(req, res) {
  const userx = await Token.destroy({ where: { user_id: req.user.id } })
  return (userx) ? res.json(message.success("User Logged Out Successfully")) : res.json(message.failed("Unable to Logged Out"));
}

//Logout User
 async function logout (req, res) {
  let result = await Token.destroy({ where: { user_id: req.user.id, token: req.header('Authorization')?.split(' ')[1] } });
  return res.json(reply.success("Logout Successfully", result));

}

// Export all Function's
export default {
  create, show, deletex, update, login, hardLogout, logout, sendMail, changePassword, profile_show, forgetPassword, resendOtp
}
