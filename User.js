import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";
import Role from "./Role.js";
import Designation from "./Designation.js";
import Team from "./Team.js";
import Shift from "./Shift.js";
import Candidate from "./Candidate.js";
const User = sequelize.define('User', {
  id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
  gender: { type: DataTypes.STRING },
  role_id: { type: DataTypes.INTEGER },
  candidate_id: { type: DataTypes.INTEGER ,allowNull: true},
  designation_id: { type: DataTypes.INTEGER },
  team_id: { type: DataTypes.INTEGER, allowNull: true },
  active_status: { type: DataTypes.BOOLEAN, defaultValue: true },
  otp: { type: DataTypes.INTEGER },
  expired_at: { type: DataTypes.STRING },
  // shift_id: { type: DataTypes.INTEGER,allowNull: true},
});

User.belongsTo(Role, { foreignKey: 'role_id' });
User.belongsTo(Designation, { foreignKey: 'designation_id' });
User.belongsTo(Team, { foreignKey: 'team_id' });
User.belongsTo(Candidate, { foreignKey: 'candidate_id' });

await User.sync;
// await User.sync({ alter: true });// 


export default User;

