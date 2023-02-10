import Shift from "../models/Shift.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";
import moment from "moment";


// Create  Shift
async function create(req, res) {
  let request = req.body;

  let validation = new Validator(request, {
    title: 'required',
    start_time: 'required',
    end_time: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }
  if (request.start_time) {
    let check2 = moment(request.start_time, 'HH:mm:ss', true).isValid();
    if (check2 == false) {
      return res.json(message.failed("Invalid Start time formate"));
    }
  }
  if (request.end_time) {
    let check2 = moment(request.end_time, 'HH:mm:ss', true).isValid();
    if (check2 == false) {
      return res.json(message.failed("Invalid End time formate"));
    }
  }

  if (request.core_start_time) {
    let check2 = moment(request.core_start_time, 'HH:mm:ss', true).isValid();
    if (check2 == false) {
      return res.json(message.failed("Invalid Core Start time formate"));
    }
  }

  if (request.core_end_time) {
    let check2 = moment(request.core_end_time, 'HH:mm:ss', true).isValid();
    if (check2 == false) {
      return res.json(message.failed("Invalid Core End time formate"));
    }
  }

  Shift.create(req.body).then((data) => res.json(message.success(" Shift Created Successfully", request)))

};

// Export all Function's
export default {
  create
}