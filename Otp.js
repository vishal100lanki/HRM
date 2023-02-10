import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

const Otp = sequelize.define('otp', {
  otp:{type: DataTypes.INTEGER},
  expired_at: {type: DataTypes.STRING } ,
  user_id:{type: DataTypes.INTEGER},
  
  
});


await Otp.sync();
export default Otp;