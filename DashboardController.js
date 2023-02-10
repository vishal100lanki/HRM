import sequelize from "sequelize";
import Attendance from "../models/Attendance.js";
import Expenses from "../models/Expenses.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import _ from 'lodash';
import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize'
import Candidate from "../models/Candidate.js";
import exactMath from 'exact-math';
import InterviewList from "../models/InterviewList.js";
import Assets from "../models/Assets.js";
import message from "../../Traits/message.js";
import InterviewSchedule from "../models/Interview_schedule.js";
import Designation from "../models/Designation.js";

async function length(req, res) {

  let today = new Date()
  //  Users
  const user_count = await User.count();
  const designation_count = await Designation.count();
  const team_count = await Team.count();

  //Expenses
  const expenses_amount = await Expenses.findOne({
    attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total_amount']],
    raw: true
  });
  // return res.send({expenses_amount});
  const expenses_count = await Expenses.count();

  const assets_amount = await Assets.findOne({
    attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total_amount']],
    raw: true
  });
  //  return res.send({assets_amount});

  let remain_balance = 0;
  if(assets_amount.total_amount != null && expenses_amount.total_amount != null){
  remain_balance = exactMath.sub(assets_amount.total_amount,expenses_amount.total_amount);

  }
  // return res.send({remain_balance});


  //Candidates
  let  candidate = await Candidate.findAll({ where: { createdAt: { [Op.between]: [startOfDay(today), endOfDay(today)] } } });
  let new_candidates = candidate.length;
//  return res.send({new_candidates});

  //Interview
  let  interview = await InterviewSchedule.findAll({ where: { createdAt: { [Op.between]: [startOfDay(today), endOfDay(today)] } } });
  let today_interview_scheduled = interview.length;
  // return res.send({today_interview_scheduled});


  let s_status = _.filter(interview, function (o) { return o.status == 'selected'; });
  let r_status = _.filter(interview, function (o) { return o.status == 'rejected'; });
  let l_status = _.filter(interview, function (o) { return o.status == 'pending'; });
  // let count_status  = status.length;


  //Attendance
  let attendance = await Attendance.findAll({ where: { createdAt: { [Op.between]: [startOfDay(today), endOfDay(today)] } } });

  let total_present = _.filter(attendance, function (o) { return o.status == 'present'; });
  let count_present = total_present.length;

  let total_absent = _.filter(attendance, function (o) { return o.status == 'absent'; });
  let count_absent = total_absent.length;

  let total_leave = _.filter(attendance, function (o) { return o.status == 'leave'; });
  let count_leave = total_leave.length;


  let data = {
    total_user: user_count,
    total_designation: designation_count,
    total_team: team_count,
    expenses_amount: expenses_amount.total_amount,
    assets_amount:assets_amount.total_amount,
    remain_balance:remain_balance,
    present_today: count_present,
    absent_today: count_absent,
    on_leave_today: count_leave,
    new_candidates:new_candidates,
    today_interview_scheduled:today_interview_scheduled,
    status:{
      s:s_status.length,
      r:r_status.length,
      l:l_status.length
    },
 
    remain_balance:remain_balance,
  }
  return (data != 0) ? res.json(message.success("Dashboard Data Fetch Successfully", data)) : res.json(message.failed("Unable to Fetch Data"));
  // return res.send({data})
}

export default {
  length
}