
import Sequelize from "sequelize";
import sequelize from '../../database/db.js';
import moment from 'moment'
import { DATEONLY } from "sequelize";
import Designation from "./Designation.js";

const Candidate = sequelize.define("candidate", {
  id: {allowNull: false,autoIncrement: true,primaryKey: true,type: Sequelize.INTEGER},
  name: {type: Sequelize.STRING,allowNull: false},
  date_of_birth: {type: Sequelize.DATEONLY},
  mobile_number: {type: Sequelize.STRING,allowNull:false},
  gender: {type: Sequelize.STRING},
  current_location: {type: Sequelize.STRING,allowNull: false},
  permanent_address: {type: Sequelize.STRING},
  email: {type: Sequelize.STRING,unique: true},
  marital_status: {type: Sequelize.STRING},
  do_you_smoke: {type: Sequelize.STRING},
  do_you_consume_alcohol: {type: Sequelize.STRING,allowNull: false},
  do_you_have_a_police_record: {type: Sequelize.STRING,allowNull: false},
  differently_abled: {type: Sequelize.STRING,allowNull: false},
  have_you_been_interviewed_by_us_in_last_six_month: {type: Sequelize.STRING,allowNull: false},
  do_you_have_a_history_of_any_major_illness: {type: Sequelize.STRING,allowNull: false},
  how_did_you_learn_about_the_opening: {
    type: Sequelize.STRING,
    allowNull: false
  },
  current_position: {
    type: Sequelize.STRING,
    allowNull: false
  },
  edu: {
    type: Sequelize.TEXT,
    allowNull: false,
    set(value) {
          this.setDataValue('edu', JSON.stringify(value));
        },
        get() {
          const rawValue = this.getDataValue('edu');
          // return rawValue;
          return (rawValue != undefined) ? JSON.parse(rawValue) : [];
          // return (rawValue != "") ? JSON.parse(rawValue) : []; 
        }

  },

  current_organisation: {
    type: Sequelize.STRING,

  },
  current_designation: {
    type: Sequelize.STRING,

  },
  total_experience: {
    type: Sequelize.STRING,

  },
  fixed_salary: {
    type: Sequelize.INTEGER,

  },
  bonus_incentive: {
    type: Sequelize.INTEGER,

  },
  total_salary: {
    type: Sequelize.INTEGER,

  },
  expected_salary: {
    type: Sequelize.INTEGER,

  },
  notice_period: {
    type: Sequelize.STRING,

  },
  workTrainee: {
    type: Sequelize.TEXT,
    allowNull: false,
    set(value) {
      this.setDataValue('workTrainee', JSON.stringify(value));
    },
    get() {
      const rawValue = this.getDataValue('workTrainee');
      // return rawValue;
      return (rawValue != undefined) ? JSON.parse(rawValue) : [];
      // return JSON.parse(rawValue) 
    }
  },
  designation_id: {
    type: Sequelize.INTEGER,

  },

status: {
  type: Sequelize.STRING,
  defaultValue: "pending"
  },

  is_transfer: {
    type: Sequelize.BOOLEAN, defaultValue: 0,
    }
}
);

// Candidate.sync({ alter: true }) ;
// await Candidate.sync({force:true})
await Candidate.sync(); 

Candidate.belongsTo(Designation, {foreignKey: 'designation_id'});
export default Candidate;