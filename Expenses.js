import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";
import ExpensesType from "./ExpensesType.js";


 const Expenses = sequelize.define("expenses", {

    name:{type: DataTypes.STRING, allowNull: false},
    expenses_type_id:{type: DataTypes.INTEGER},
    amount:{type: DataTypes.INTEGER},
    billing_image:{type: DataTypes.STRING,allowNull: false,
        get() {
           return process.env.API_HOST+'uploads/'+this.getDataValue('billing_image')
        }},
});

Expenses.belongsTo(ExpensesType , {foreignKey: 'expenses_type_id' });
await Expenses.sync();

export default Expenses;