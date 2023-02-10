import _ from "lodash";
import Sequelize from "sequelize";
import sequelize from '../../database/db.js';

const DocumentType = sequelize.define("document_type", {


    doc_title: { type: Sequelize.STRING, allowNull: false,unique: true ,
        set(value) {
            this.setDataValue('doc_title', value);
        }
    },
    slug: {  type: Sequelize.STRING},
});

await DocumentType.sync();
export default DocumentType;

