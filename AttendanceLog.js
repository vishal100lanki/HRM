import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";
import Attendance from "./Attendance.js";
import User from "./User.js";

const Attendance_log = sequelize.define("attendance_log", {

    attendance_id:{type: DataTypes.INTEGER},
    user_id:{type: DataTypes.INTEGER},
    old_out_time :{type: DataTypes.STRING},
    old_out_time_date:{type: DataTypes.DATEONLY},
    new_out_time:{type: DataTypes.STRING},
    new_out_time_date:{type: DataTypes.DATEONLY},
    updated_by:{type: DataTypes.STRING},
});
Attendance_log.belongsTo(User , {foreignKey: 'user_id' });
Attendance_log.belongsTo(Attendance , {foreignKey: 'attendance_id' });
await Attendance_log.sync();

export default Attendance_log;