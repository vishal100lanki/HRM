import Sequelize from "sequelize";
import sequelize from "../../database/db.js";
import Candidate from "./Candidate.js";
import Designation from "./Designation.js";

import User from "./User.js";

const InterviewList = sequelize.define("interview_list", {
    user_id: { type: Sequelize.INTEGER },
    designation_id:{ type: Sequelize.INTEGER },
    candidate_id:{ type: Sequelize.INTEGER },
    candidate_name: { type: Sequelize.STRING },
    for_position:{ type: Sequelize.STRING },
    schedule : { type: Sequelize.TIME},
    interview_by : { type: Sequelize.STRING },
    status: 
    {type: Sequelize.STRING,allowNull: false},
});

await InterviewList.sync();
InterviewList.belongsTo(Designation, { foreignKey: 'designation_id' });
InterviewList.belongsTo(User, { foreignKey: 'user_id' });
InterviewList.belongsTo(Candidate, { foreignKey: 'candidate_id' });
export default InterviewList;