import Sequelize from "sequelize";
import sequelize from "../../database/db.js";
import Candidate from "./Candidate.js";
import InterviewReview from "./InterviewReview.js";
import InterviewRound from "./InterviewRound.js";
import User from "./User.js";

const InterviewSchedule = sequelize.define("interview_schedule", {
    user_id: { type: Sequelize.INTEGER },
    candidate_id: { type: Sequelize.INTEGER, allowNull: false },
    interview_type:{ type: Sequelize.STRING},
    interview_round_id: { type: Sequelize.INTEGER, allowNull: false },
    interview_timing: {type: Sequelize.TIME,allowNull:true},
    interview_date:{type: Sequelize.DATEONLY},
    status: {type: Sequelize.STRING,
        defaultValue: "scheduled",
    },
    resion:{ type: Sequelize.STRING,allowNull:true}
});

await InterviewSchedule.sync();
// InterviewSchedule.sync({alter:true}) ;
InterviewSchedule.belongsTo(User,  { foreignKey: 'user_id', as: 'Users' });
InterviewSchedule.belongsTo(Candidate, { foreignKey: 'candidate_id' , as: 'Candidates'});
InterviewSchedule.belongsTo(InterviewRound, { foreignKey: 'interview_round_id' });
InterviewSchedule.hasOne(InterviewReview, { foreignKey:"interview_schedule_id", targetKey: 'id'  });
export default InterviewSchedule;