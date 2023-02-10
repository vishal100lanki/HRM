import Sequelize from "sequelize";
import sequelize from '../../database/db.js';


const UserDocument = sequelize.define("user_document", {
    id: {allowNull: false,autoIncrement: true,primaryKey: true,type: Sequelize.INTEGER},
    document_type_slug: { type: Sequelize.STRING },
    candidate_id: { type: Sequelize.INTEGER, allowNull: false },
    user_id: { type: Sequelize.INTEGER },
    document_path: {
        type: Sequelize.STRING,
        get() {
            return process.env.API_HOST + '' + this.getDataValue('document_path')
        }
    },
});


await UserDocument.sync();

export default UserDocument ;




    