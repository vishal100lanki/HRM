import Attendance from "../models/Attendance.js"
import Validator from 'validatorjs';
import message from "../../Traits/message.js";
import User from "../models/User.js";
import moment from "moment";
import exactMath from 'exact-math';
import {dateToStamp} from "../../Traits/attendanceStatus.js";
import Attendance_log from "../models/AttendanceLog.js";
import validateDate from 'validate-date';


const ATTENDANCE_TIME = {
    in_time: "09:30:00",
    out_time: "18:00:00",
    t_duration: 30600
  };
  
async function create(req, res) {
    let request = req.body;
    let validation = new Validator(request, {
        attendance_id: 'required',
        user_id: 'required',
        // old_out_time: 'required',
        // old_out_time_date: 'required',
        new_out_time: 'required',
        new_out_time_date: 'required',

    });

    if (validation.fails()) {
        let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
        return res.json(message.failed(validation.errors.first(err_key)));
    }

    let attendance = await Attendance.findByPk(request.attendance_id);
    if (!attendance) {
        return res.json(message.failed("This Attendance is not exists"));
    }
    let out_time = attendance.out_time;
    let in_time = attendance.in_time;
    let out_time_date = attendance.out_time_date;
    let date = attendance.date;
    // return res.send(out_time_date)
    let user = await User.findByPk(request.user_id);
    if (!user) {
        return res.json(message.failed("This User is not exists"));
    }

    if (request.new_out_time) {
        let check2 = moment(request.new_out_time, 'HH:mm:ss', true).isValid();
        if (check2 == false) {
            return res.json(message.failed("Invalid time formate"));
        }
    }


    if (request.new_out_time_date) {
        let check = validateDate(request.new_out_time_date, 'boolean');
        if (check == false) {
            return res.json(message.failed("Invalid date formate"));
        }
    }

    let full_date = request.new_out_time_date + ' ' + request.new_out_time;
    var toTimestamp = Math.floor(new Date(full_date).getTime() / 1000);
    var toTimestamp = dateToStamp(request.new_out_time_date,request.new_out_time);
    let duration = exactMath.sub(toTimestamp, in_time);
    
    let extra_time = ( duration > ATTENDANCE_TIME.t_duration ) ? exactMath.sub(duration, ATTENDANCE_TIME.t_duration) : null ;

    let data = {
        attendance_id: request.attendance_id,
        user_id: request.user_id,
        old_out_time: out_time,
        old_out_time_date: out_time_date,
        new_out_time: toTimestamp,
        new_out_time_date: request.new_out_time_date,
        updated_by: req.user.id ?? "0",
    }
    var attendancelog = await Attendance_log.create(data);
    if(attendancelog){
    
      var  new_update = await Attendance.update(
        {
            out_time:data.new_out_time,
            out_time_date:data.new_out_time_date,
            duration:duration,
            extra_time:extra_time,
            updated_by:data.updated_by
        },{
            where: {user_id:data.user_id }
        });
    }
    return (attendancelog != 0) ? res.json(message.success("User Updated Successfully", data)) : res.json(message.failed("Unable to Update User"));
}

export default {
    create
}