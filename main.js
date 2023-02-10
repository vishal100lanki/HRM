// ############################ User  ################################ 
import User from "./User.js";
// // Relations
// User.belongsTo(Role , {foreignKey: 'role_id' });
// User.belongsTo(Designation, { foreignKey: 'designation_id' });
// User.belongsTo(Team, { foreignKey: 'team_id' });

// // Exports
// export const UserModel = User ;


// ############################ User-Document ################################
import UserDocument from "./uploadDocuments.js";
// Relations
UserDocument.belongsTo(Candidate, { foreignKey: 'candidate_id' });
UserDocument.belongsTo(DocumentType, { foreignKey: 'document_type_slug' });
UserDocument.belongsTo(User, { foreignKey: 'user_id' });
// UserDocument.belongsTo(UserDocumentModel, { foreignKey: 'document_type_slug' });


// ############################ Candidate ################################
import Candidate from "./Candidate.js";




// ############################  Role   ################################
import Role from "./Role.js";

// ############################  Team   ################################
import Team from "./Team.js";

// ############################  Token   ################################
import Token from "./Token.js";

// ############################  Shift   ################################
import Shift from "./Shift.js";

// ############################  Reset Password   ################################
import ResetPassword from "./ResetPassword.js";

// Relations
// ResetPassword.belongsTo(User , {foreignKey: 'user_id' });




// ############################  Interview Round   ################################
import InterviewRound from "./InterviewRound.js";

// ############################  Interview List   ################################
import InterviewList from "./InterviewList.js";

// Relations
// InterviewList.belongsTo(Position, { foreignKey: 'position_id' });
// InterviewList.belongsTo(User, { foreignKey: 'user_id' });
// InterviewList.belongsTo(Candidate, { foreignKey: 'candidate_id' });


// ############################  Interview   ################################
// import Interview from "./InterviewReview.js";

// Relations
// Interview.belongsTo(Position, { foreignKey: 'position_id' });
// Interview.belongsTo(User,  { foreignKey: 'user_id', as: 'Users' });
// Interview.belongsTo(Candidate, { foreignKey: 'candidate_id' });


// ############################  Interview Schedule  ################################
// import InterviewSchedule from "./InterviewSchedule.js";

//Relations
// InterviewSchedule.belongsTo(User,  { foreignKey: 'user_id', as: 'Users' });
// InterviewSchedule.belongsTo(Candidate, { foreignKey: 'candidate_id' });
// InterviewSchedule.belongsTo(InterviewRound, { foreignKey: 'interview_round_id' });



// ############################  Expenses Type   ################################
import expenses_type from "./ExpensesType.js";

//

// ############################  Expenses   ################################
import Expenses from "./Expenses.js";

// Relation
// Expenses.belongsTo(ExpensesType , {foreignKey: 'expenses_type_id' });








// ############################  Document Type   ################################
import DocumentType from "./DocumentType.js";







// ############################  Designation   ################################
import Designation from "./Designation.js";











// Exports
export const UserDocumentModel = UserDocument ;
// export const UserModel  = User ;
// export const TeamModel  = Team ;
// export const TokenModel = Token ;
// export const ShiftModel = Shift ;
// export const RoleModel  = Role ;
// export const ResetPasswordModel = ResetPassword ;

// export const OtpModel = Otp ;
// export const InterviewRoundModel = InterviewRound ;
// export const InterviewListModel = InterviewList ;
// export const InterviewModel = Interview ;
// export const InterviewScheduleModel = InterviewSchedule ;
// export const ExpensesTypeModel = expenses_type ;
// export const ExpensesModel = Expenses ;
// export const DocumentTypeModel = DocumentType ;
// export const DesignationModel = Designation ;

