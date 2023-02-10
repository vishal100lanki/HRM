import Attendance from "../models/Attendance.js"
import Validator from 'validatorjs';
import message from "../../Traits/message.js";
import User from "../models/User.js";
import moment from "moment";
import { Op } from 'sequelize'
import { ATTENDANCE_STATUS, LEAVE, AttendanceStatusKeys, ABSENTS, dateToStamp } from "../../Traits/attendanceStatus.js";
import exactMath from 'exact-math';
import Attendance_log from "../models/AttendanceLog.js";
import validateDate from 'validate-date';
// import { rearg } from "lodash";


const ATTENDANCE_TIME = {
  in_time: "09:30:00",
  out_time: "18:00:00",
  t_duration: 30600
};


// Create  Attendance 
async function create(req, res) {

  let request = req.body;
  let validation = new Validator(request, {
    user_id: 'required',
    status: 'required|in:' + AttendanceStatusKeys(true),
    date: 'required', //yyyy-mm-dd     [|before_or_equal:Date.now()]
    in_time: ABSENTS.includes(request.status) ? '' : 'required', //hh:mm:ss
  })

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  if (request.date) {
    let check = validateDate(request.date, 'boolean');
    if (check == false) {
      return res.json(message.failed("Invalid In Time Date formate"));
    }
  }

  if (request.in_time) {
    let check2 = moment(request.in_time, 'HH:mm:ss', true).isValid();
    if (check2 == false) {
      return res.json(message.failed("Invalid Out Time Date formate"));
    }
  }

  let user = await User.findByPk(request.user_id);
  if (!user) {
    return res.json(message.failed("This User is not exists"));
  }

  let att = await Attendance.findOne({
    where: { "date": request.date, "user_id": request.user_id }
  });

  if (att) {
    return res.json(message.failed("Attendance already exists for this user."));
  }
  // let date = Date.now();


  var toTimestamp = (request.in_time) ? dateToStamp(request.date, request.in_time) : null;

  let fix_timming = ATTENDANCE_TIME.in_time;
  let toTimestamps = dateToStamp(request.date, fix_timming);
  //  calculate In Time 
  let late_coming = null;
  if (toTimestamps < toTimestamp) {
    late_coming = (request.in_time) ? exactMath.sub(toTimestamp, toTimestamps) : null;
  }
  let early_coming = null;
  if (toTimestamps > toTimestamp) {
    early_coming = (request.in_time) ? exactMath.sub(toTimestamps,toTimestamp) : null;
  }
 
  let data = {
    user_id: request.user_id,
    status: request.status,
    in_time: ABSENTS.includes(request.status) ? null : toTimestamp,
    date: request.date,
    late_coming: ABSENTS.includes(request.status) ? null : late_coming,
    created_by: req.user.id ?? "0",
    early_coming: early_coming 
  }

  // return res.send(data);
  let attendance = await Attendance.create(data);

  return attendance ? res.json(message.success("Attendance Created Successfully", attendance)) : res.json(message.failed('Unable to Add at this moment'));
};

// Attendance show 
async function attendance_show(req, res) {
  return res.json(message.success('Attendance Status Fetched Successfully', ATTENDANCE_STATUS));
}

// Get List of Attendance
async function show(req, res) {

  // Search Filter
  const condition = {};
  if (req.query.user_id) {
    condition.user_id = req.query.user_id
  }
  if (req.query.name) {
    condition['$Users.name$'] = { [Op.like]: req.query.name };
  }
  if (req.query.status) {
    condition.status = req.query.status
  }
  if (req.query.date) {
    condition.date = req.query.date
  }
  if (req.query.out_time_date) {
    condition.out_time_date = req.query.out_time_date
  }



  const limit = parseInt(req.query.limit);
  if (!limit) {

    const attendance = await Attendance.findAll({
    //   order: [
    //     ['id', 'DESC'],
   
    // ],
      where: condition, include:
        [{ model: User, as: 'Users', attributes: ['name'] }]
    })
    return res.json(message.success("List of All Attendance Table", attendance))
  }
  let offset = 0;
  Attendance.findAndCountAll()
    .then((data) => {
      const page = parseInt(req.query.page)
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      let currentPage = parseInt(page);
      let previousPage = (currentPage <= 1) ? null : (currentPage - 1);
      let nextPage = (currentPage >= pages) ? null : (currentPage + 1);
      Attendance.findAll({
        order: [
          ['id', 'DESC'],
     
      ],
        attributes: ['id', 'user_id', 'status', 'in_time', 'late_coming', 'date', 'out_time_date', 'out_time', 'duration', 'extra_time', 'user_id', 'lunch_in_time', 'lunch_out_time', 'updated_by', 'created_by'],
        limit: limit,
        offset: offset,
        $sort: { id: 1 },
        where: condition, include:
          [{ model: User, as: 'Users', attributes: ['name'] }]
      })
        .then((attendance) => {
          return (!attendance) ? res.json(message.failed("Attendance Not Found")) : res.json(message.success("Attendance Found Successfully", { 'count': data.count, 'totalPages': pages, 'perPage': limit, 'currentPage': currentPage, 'previousPage': previousPage, 'nextPage': nextPage, 'result': attendance }));
        });
    })
}

// Show all Users(Attandance) 
async function showAll(req, res) {
  const attendance = await Attendance.findAll();
  return res.json(message.success("All List", attendance))
}

//Update User
async function update(req, res) {
  let request = req.body;

  let validation = new Validator(request, {
    attendance_id: 'required',
    out_time: 'required',
    out_time_date: 'required',

  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  if (request.out_time) {
    let check2 = moment(request.out_time, 'HH:mm:ss', true).isValid();
    if (check2 == false) {
      return res.json(message.failed("Invalid Out time formate"));
    }
  }

  if (request.out_time_date) {
    let check = validateDate(request.out_time_date, 'boolean');
    if (check == false) {
      return res.json(message.failed("Invalid Out TIme date formate"));
    }
  }

  let user_attendance = await Attendance.findByPk(request.attendance_id);
  if (!user_attendance) {
    return res.json(message.failed("Invalid Data!!"));
   
  }

  if (user_attendance.out_time != null) {
    return res.json(message.failed("Attendance already Updated!!"));
  }


  let in_time = user_attendance.in_time;
  let date = user_attendance.date;
  var toTimestamp = dateToStamp(request.out_time_date, request.out_time);

  // calculate duration
  let duration = exactMath.sub(toTimestamp, in_time);
  // return res.send({duration}); 
  // let new_duration = await secondsToHms(duration);

  // calculate extra time
  var extra_time = (duration > ATTENDANCE_TIME.t_duration) ? exactMath.sub(duration, ATTENDANCE_TIME.t_duration) : null;
  // let new_extra_time = await secondsToHms(extra_time);
  // return res.send({new_extra_time})


  //calculate early Going User 
  let fix_time= ATTENDANCE_TIME.out_time;
  let toTimestamps = dateToStamp(request.out_time_date, fix_time);
   let early_going = null;
   if (toTimestamp < toTimestamps) {
    early_going = (request.out_time) ? exactMath.sub(toTimestamps,toTimestamp) : null;
   }



  let data = {
    out_time: toTimestamp,
    out_time_date: request.out_time_date,
    duration: duration,
    extra_time: extra_time,
    lunch_in_time: dateToStamp(date, request.lunch_in_time),
    lunch_out_time: dateToStamp(date, request.lunch_out_time),
    early_going:early_going,
    updated_by: req.user.id ?? "0"
  }

  var attendance = await Attendance.update(data, { where: { id: req.body.attendance_id } });
  return (attendance != 0) ? res.json(message.success("Attendance Updated Successfully", data)) : res.json(message.failed("Unable to Update Attendance"));
}

async function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}

// Delete a Attendance
async function deletex(req, res) {
  const attendance = await Attendance.destroy({ where: { id: req.query.id } });
  (attendance) ? res.json(message.success("Attendance Deleted successfully")) : res.json(message.failed("unable to Delete Attendance"));
}

// Export all Function's
export default {
  create, attendance_show, show, showAll, update, deletex,
}

// if Out_time<=24 ? 'in_time' - 'Out_time': res.json(message.failed(""));
// async function updateorcreate(model,where,newitem){
//   var data=await model.findOne({where});
//   if(!data){
//     var token=model.create(newitem);
//     return true;
//   }
//   var token=model.update(newitem,{where})
// }                   














