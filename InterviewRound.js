import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

 const InterviewRound = sequelize.define("interview_round", {
    interview_round:{type: DataTypes.STRING, allowNull: false , unique: true},
});
await InterviewRound.sync();

export default InterviewRound;