import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

 const Assets = sequelize.define("assets", {

    amount:{type: DataTypes.INTEGER, allowNull: false},
    paid_for:{type: DataTypes.STRING, allowNull: false},
    from :{type: DataTypes.STRING, allowNull: false},
    paid_to:{type: DataTypes.STRING, allowNull: false},
});


await Assets.sync();

export default Assets;