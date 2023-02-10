import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

 const Shift = sequelize.define("shifts", {

    title:{type: DataTypes.STRING, unique: true},
    start_time:{ type: DataTypes.STRING },
    end_time : {type: DataTypes.STRING},
    core_start_time:{ type: DataTypes.STRING },
    core_end_time : {type: DataTypes.STRING},
    status: {type: DataTypes.BOOLEAN,defaultValue: true},
});


await Shift.sync();
// Shift.sync({alter:true}) ;
export default Shift;