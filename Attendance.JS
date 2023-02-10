import Sequelize from "sequelize";
import sequelize from '../../database/db.js';
import User from "./User.js";


 const Attendance = sequelize.define("attendence", {

id: {allowNull: false,autoIncrement: true, primaryKey: true,type: Sequelize.INTEGER },
status: {type: Sequelize.STRING,allowNull: false},
in_time: { type: Sequelize.STRING },
out_time: {type: Sequelize.STRING},
date: {type: Sequelize.DATEONLY},
out_time_date: {type: Sequelize.DATEONLY},
duration: {type: Sequelize.STRING},
extra_time: {type: Sequelize.STRING},
late_coming: {type: Sequelize.STRING},
early_coming:{type: Sequelize.STRING},
early_going:{type: Sequelize.STRING},
lunch_in_time: {type: Sequelize.STRING,allowNull:true},
lunch_out_time: { type: Sequelize.STRING},
user_id: {type: Sequelize.INTEGER},
created_by: { type: Sequelize.STRING},
updated_by: { type: Sequelize.STRING},

});

Attendance.belongsTo(User,  { foreignKey: 'user_id', as: 'Users' });

// Attendance.sync({alter:true}) ;
//Attendence.sync({ force:true }) 
await Attendance.sync();
export default Attendance;

