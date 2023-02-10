import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

const Role = sequelize.define("role", {

role_name:{type: DataTypes.STRING, allowNull: false, unique: true},
role_description:{type: DataTypes.STRING,allowNull: true},
});


await Role.sync();

export default Role;