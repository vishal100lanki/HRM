import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

 const Team = sequelize.define("team", {
    id: {allowNull: false,autoIncrement: true,primaryKey: true, type: DataTypes.INTEGER},
    team_name:{type: DataTypes.STRING, allowNull: false , unique: true},
});


await Team.sync();

export default Team;