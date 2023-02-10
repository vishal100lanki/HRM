import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

 const expenses_type = sequelize.define("expenses_type", {
    expenses_type:{ type:DataTypes.STRING, allowNull:false, unique:true },
});


await expenses_type.sync();
export default expenses_type;