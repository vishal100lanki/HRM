import Sequelize from "sequelize";
import sequelize from '../../database/db.js';
import User from "./User.js";
const ResetPassword = sequelize.define("resetpassword", {
    user_id: { type:Sequelize.INTEGER,allowNull: true},
   old_password: {type: Sequelize.STRING,allowNull: false},
   new_password: {type: Sequelize.STRING,allowNull: false},
   confirm_password: {type: Sequelize.STRING,allowNull: false},
    });
    
    ResetPassword.belongsTo(User , {foreignKey: 'user_id' });
    await ResetPassword.sync();
    export default ResetPassword;

    