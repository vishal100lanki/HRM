import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

const  Designation = sequelize.define("designation", {
    id: {allowNull: false,autoIncrement: true,primaryKey: true, type: DataTypes.INTEGER},
    designation_name:{type: DataTypes.STRING, allowNull: false, unique: true}
});

await Designation.sync();

export default Designation;


