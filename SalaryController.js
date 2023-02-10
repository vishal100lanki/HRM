import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";
import _ from 'lodash';
import sequelize, { DATEONLY } from "sequelize";
import exactMath from 'exact-math';
import moment from "moment";
import { Op } from "sequelize";
import { response } from "express";

// import { spliceStr } from "sequelize/types/utils.js";
const ATTENDANCE_TIME = {
  in_time: "09:30:00",
  out_time: "18:00:00",
  t_duration: 30600
};

// SunDay in a month
function weekend(year, month, day) {

  let d = [];
  let last_date = new Date(year, month, 0).getDate();
  for (let index = 0; index <= last_date; index++) {
    let date = `${year}-${month}-${index}`;

    if (day.includes(new Date(date).getDay())) {
      d.push(date);

    }
  }


  return d;

}
// Get User 
async function show(req, res) {
 
  let total_days = new Date(req.query.year, req.query.month, 0).getDate();
  let start_date = `${req.query.year}-${req.query.month}-01`;
  let end_date = `${req.query.year}-${req.query.month}-${total_days}`;

  let attendance = await Attendance.findAll();
  //Count-Total days of Present
  let total_present = _.filter(attendance, function (o) { return o.user_id == req.query.user_id && o.status == 'present'; });
    //Count-Total days of Absent
    let total_absent = _.filter(attendance, function (o) { return o.user_id == req.query.user_id && o.status == 'absent'; });

  let count_present = total_present.length;
  
  // let ab_date= total_absent.date;
  // return res.send({total_absent})
  let count_absent = total_absent.length;
  //Count-Total days of Leave
  let total_leave = _.filter(attendance, function (o) { return o.user_id == req.query.user_id && o.status == 'leave'; });
  let count_leave = total_leave.length;

  //Count-Total days of Short-Leave
  let total_short_leave = _.filter(attendance, function (o) { return o.user_id == req.query.user_id && o.status == 'short_leave'; });
  let count_short_leave = total_short_leave.length;
  //Count-Total days of half-Day
  let total_half_day = _.filter(attendance, function (o) { return o.user_id == req.query.user_id && o.status == 'half_day'; });
  let count_half_day = total_half_day.length;
  //Count-Total Duration
  let count_duration = await Attendance.findOne({
    where: { user_id: req.query.user_id },
    attributes: ['user_id',
      [sequelize.fn('sum', sequelize.col('duration')), 'total_duration']],
    group: ['user_id'],
    raw: true
  });
  let new_duration = await secondsToHms(count_duration);
  //Count-Total Extra-Time
  let count_extra_time = await Attendance.findOne({
    where: { user_id: req.query.user_id },
    attributes: ['user_id',
      [sequelize.fn('sum', sequelize.col('extra_time')), 'total_extra_time']],
    group: ['user_id'],
    raw: true
  });
  let new_extra_time = await secondsToHms(count_extra_time);
  //Count-Total Late-Comming
  let count_late_comming = await Attendance.findOne({
    where: { user_id: req.query.user_id },
    attributes: ['user_id',
      [sequelize.fn('sum', sequelize.col('late_coming')), 'total_late_time']],
    raw: true
  });
  let new_late_time = await secondsToHms(count_late_comming.total_late_time);

  // weekends 
  let y = req.query.year;
  let m = req.query.month;
  let day = [0, 6]; // getting sunday and saturday
  // let days = [1,2,3,4,5]
  let response = weekend(y, m, day);


  // check is first index is saturday
  const is_saturday = new Date(`${y}-${m}-${response[0]}`).getDay() == 6 ? true : false;

 
  // Sandwich Leave  
  let x = _.chunk(response, 2);

  let t_x = 0;
  x.map((v) => {

    t_x = t_x + 1;
  });
 
  // return res.send(t_x)
  let arr = []; 
  x.forEach(element => {

    const date = new Date(element[0]);
    let pdate = new Date(date.setDate(date.getDate() - 1));
    var result = moment(pdate);
    let x = (result.format("YYYY-MM-DD"));
    const date2 = new Date(element[1]);
    let fdate = new Date(date2.setDate(date2.getDate() + 1));
    var result = moment(fdate);
    let y = (result.format("YYYY-MM-DD"));
 let  weekdays =  new Date(date.setDate(date.getDate() - 1));
//  return res.send(weekdays)
    arr.push(x);
    arr.push(element[0]);
    arr.push(element[1]);
    arr.push(y);

  });

  let xx = _.chunk(arr, 4);
  xx.forEach(element => {
    
    let find = _.filter(total_absent, function (o) { return (o.date == element[0] || o.date == element[3]); });
    if (find.length == 2) {  // means user absent on friday and monday.
      total_absent.push({ date: element[1] }); // saturday
      total_absent.push({ date: element[2] }); // sunday
    }
    // return res.send({find});

//     //Find 5 Day's
//     let working_days =  weekend(y, m, day);
//     return res.send(working_days)
//     var currentDate = new Date();
//     var firstday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
//     var lastday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 5));
//     // var result = moment(firstday);
//     // var results = moment(lastday);
//     // let monday = (result.format("YYYY-MM-DD"));
//     // let friday = (results.format("YYYY-MM-DD"));
// // return res.send({monday,friday})
  });


/////// 3 days Present Rule 

var count=0;
  var r=total_absent.map((c)=>{
    if(c.status=="absent")
    {
      var f=new Date(c.date).getDay()
   
      if(count<3)
      {
        if(f!==5){
          count=count+1
        }
        else{
          count++;
          var c=count
          count=0;
        }
      }
   if(c>2){

   }
   else{
    console.log(count);
   }
      return f

    }
   
     
    
  })

  return res.send({total_absent});






  // const limit = parseInt(req.query.limit);
  // if (!limit) {
  //   let query = {
  //     where: {
  //       createdAt: {
  //         [Op.gte]: new Date(start_date),
  //         [Op.lt]: new Date(end_date)
  //       }
  //     }
  //   };

    let attendanceLog = {
      present: count_present,
      absent: count_absent,
      leave: count_leave,
      short_leave: count_short_leave,
      half_day: count_half_day,
      duration: new_duration,
      extra_time: new_extra_time,
      late_coming: new_late_time,
      day: total_absent
    }



    return res.json(message.success(" User's Attendance Detail ", attendanceLog))

  }

// Sec and Hrs
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

//  Export's
export default {
  show
}
