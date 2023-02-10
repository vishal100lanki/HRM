import InterviewRound from "../models/InterviewRound.js";
import Validator from 'validatorjs';
import message from "../../Traits/message.js";

// Create  Interview Round 
async function create(req, res) {
  let data = req.body;
  let validation = new Validator(data, {
    interview_round: 'required',
  });

  if (validation.fails()) {
    let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(message.failed(validation.errors.first(err_key)));
  }

  let round = await InterviewRound.findAll({ where: { interview_round: req.body.interview_round } });
  if (round.length != 0) {
    return res.json(message.failed(" This interview_round is already exists "));
  }

  InterviewRound.create(req.body).then((data) => res.json(message.success(" Interview Round Created Successfully", data)))
};

// Get List of Interview Round 
async function show(req, res) {
  
  // Search Filter
  const condition = {};
  if(req.query.interview_round){ 
    condition.interview_round=req.query.interview_round
  }

  const limit = parseInt(req.query.limit);
  if(!limit){
    const interview_round = await InterviewRound.findAll({where: condition
      })
    return res.json(message.success("List of All Interview Round's", interview_round))
  }
  let offset = 0;
  InterviewRound.findAndCountAll()
  .then((data) => {

    const page = parseInt(req.query.page)
    let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1);
        let currentPage = parseInt(page);
        let previousPage = (currentPage <= 1) ? null : (currentPage-1);
        let nextPage = (currentPage>= pages) ? null : (currentPage+1);
        InterviewRound.findAll({ 
    attributes: ['id','interview_round'],
    limit: limit,
    offset: offset,
    $sort: { id: 1 },
    where: condition})
    .then((interview_round) =>{ return (!interview_round) ? res.json(message.failed("This Interview Round is Not Found")) : res.json(message.success ("List of All Interview Rounds's",{'count': data.count, 'totalPages': pages, 'perPage' : limit, 'currentPage' : currentPage, 'previousPage': previousPage, 'nextPage' : nextPage, 'result': interview_round}));
  });

})

}


// Update a Interview Round
async function update(req, res) {
    let data = req.body;
    let validation = new Validator(data, {
      interview_round: 'required',
    });
  
    if (validation.fails()) {
      let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
      return res.json(message.failed(validation.errors.first(err_key)));
    }
  
    let round = await InterviewRound.findAll({ where: { interview_round: req.body.interview_round } });
    if (round.length != 0) {
      return res.json(message.failed(" This interview_round is already exists "));
    }

    var interview_round = await InterviewRound.update(data, { where: { id: req.query.id } });
    return (interview_round != 0) ? res.json(message.success("Interview Round updated successfully", data)) : res.json(message.failed("unable to update This Interview Round "));
}

// Delete a Interview Round
async function deletex(req, res) {
    const interview_round = await InterviewRound.destroy({ where: {id:req.query.id}});
    return  (interview_round) ? res.json(message.success("interview round Deleted successfully")) : res.json(message.failed("This interview round is not exists"));
}

// // Export all Function's
export default {
    create,show,update,deletex
    
  }