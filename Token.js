import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

const Token = sequelize.define('Token', {
  token_id:{type: DataTypes.STRING},
  // token: {type: DataTypes.STRING} ,
  user_id:{type: DataTypes.STRING}
});

await Token.sync();

export default Token;