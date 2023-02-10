import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";
import InterviewSchedule from "./Interview_schedule.js";
// import InterviewSchedule from "./Interview_schedule.js";
// import Candidate from "./Candidate.js";


const InterviewReview = sequelize.define('interview_review', {
    interview_schedule_id: { type: DataTypes.INTEGER ,allowNull: true},
    culture_fitment: { type: DataTypes.STRING },
    technical_skills: { type: DataTypes.STRING },
    overall_ranking: { type: DataTypes.STRING },
    salary: { type: DataTypes.INTEGER },
    relevant_job_experience: { type: DataTypes.STRING },
    interpersonal_skills: { type: DataTypes.STRING },
    education: { type: DataTypes.STRING },
    supervisory_experience: { type: DataTypes.STRING },
    motivation: { type: DataTypes.STRING },
});
// InterviewReview.belongsTo(InterviewSchedule, { foreignKey: 'interview_schedule_id' , targetKey: 'id'});

await InterviewReview.sync();
export default InterviewReview;

