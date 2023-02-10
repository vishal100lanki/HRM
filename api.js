import express from "express";
import UserController from "../app/controllers/UserController.js";
import DesignationController from "../app/controllers/DesignationController.js";
import ExpensesController from "../app/controllers/ExpensesController.js";
import ExpensesTypeController from "../app/controllers/ExpensesTypeController.js";
import AssetsController from "../app/controllers/AssetsController.js";
import TeamController from "../app/controllers/TeamController.js";
import AttendanceController from "../app/controllers/AttendanceController.js";
import AttendanceLogController from "../app/controllers/AttendanceLogController.js";
import RoleController from "../app/controllers/RoleController.js";
import CandidateController from "../app/controllers/CandidateController.js";
import InterviewListController from "../app/controllers/InterviewListController.js";
import DashboardController from "../app/controllers/DashboardController.js";
import SalaryController from "../app/controllers/SalaryController.js";
import Authorization from "../app/middleware/auth.js"; ``
import multer from "multer";
import bodyParser from 'body-parser';
import ShiftController from "../app/controllers/ShiftController.js";
import DocumentTypeController from "../app/controllers/DocumentTypeController.js";
import UserDocumentController from "../app/controllers/UserDocumentController.js";
import cpUpload from '../Traits/UploadPDF.js';
import InterviewRoundController from "../app/controllers/InterviewRoundController.js";
import InterviewScheduleController from "../app/controllers/InterviewScheduleController.js";
import InterviewReviewController from "../app/controllers/InterviewReviewController.js";

const Router = express.Router();

Router.use(bodyParser.json());

// image upload  using multer
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads');
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
   }
});
var upload = multer({ storage: storage });




// ###########################################   USER   ##########################################
// User Group
Router.post('/create', UserController.create);
Router.get('/get', Authorization, UserController.show);
Router.put('/update', Authorization, UserController.update);
Router.delete('/delete', Authorization, UserController.deletex);
Router.post('/sendMail', UserController.sendMail);
Router.put('/change-password', Authorization, UserController.changePassword);
Router.put('/forget-password', UserController.forgetPassword);
Router.post('/resend-otp', UserController.resendOtp);
Router.get('/profile-get', Authorization, UserController.profile_show);

// Auth 
Router.post('/login', UserController.login);  //LOGIN
Router.delete('/hardlogout', Authorization, UserController.hardLogout);
Router.delete('/logout', Authorization, UserController.logout);
Router.get('/dashboard', Authorization, DashboardController.length);


// // Designation Group
Router.post('/designation-create', Authorization, DesignationController.create);
Router.get('/designation-get', Authorization, DesignationController.show);
Router.put('/designation-update', Authorization, DesignationController.update);
Router.delete('/designation-delete', Authorization, DesignationController.deletex);

// ###########################################  Department   ##########################################


// Router.post('/department-create', Authorization, DepartmentController.create);
// Router.get('/department-get', Authorization, DepartmentController.show);
// Router.put('/department-update', Authorization, DepartmentController.update);
// Router.delete('/department-delete', Authorization, DepartmentController.deletex);


// ###########################################   EXPENSES   ##########################################

// Expenses Group
Router.post('/expenses-create', Authorization, upload.single('billing_image'), ExpensesController.create);
Router.get('/expenses-get', Authorization, ExpensesController.show);
Router.put('/expenses-update', Authorization, upload.single('billing_image'), ExpensesController.update);
Router.delete('/expenses-delete', Authorization, ExpensesController.deletex);

// ExpensesType Group
Router.post('/expenses-type-create', Authorization, ExpensesTypeController.create);
Router.get('/expenses-type-get', Authorization, ExpensesTypeController.show);
Router.put('/expenses-type-update', Authorization, ExpensesTypeController.update);
Router.delete('/expenses-type-delete', Authorization, ExpensesTypeController.deletex);

// ## ASSETS ##

// Assets Group
Router.post('/assets-create', Authorization, AssetsController.create);
Router.get('/assets-get', Authorization, AssetsController.show);
Router.put('/assets-update', Authorization, AssetsController.update);
Router.delete('/assets-delete', Authorization, AssetsController.deletex);


// ###########################################   TEAM   ##########################################


Router.post('/team-create', Authorization, TeamController.create);
Router.get('/team-get', Authorization, TeamController.show);
Router.put('/team-update', Authorization, TeamController.update);
Router.delete('/team-delete', Authorization, TeamController.deletex);


// ###########################################   ATTENDANCE   ##########################################


Router.post('/attendance-create', Authorization, AttendanceController.create);
Router.get('/attendance-get', Authorization, AttendanceController.show);
Router.get('/attendance-get-show', Authorization, AttendanceController.attendance_show);
Router.get('/attendance-get-all', Authorization, AttendanceController.showAll);
Router.put('/attendance-update', Authorization, AttendanceController.update);
Router.delete('/attendance-delete', Authorization, AttendanceController.deletex);

Router.post('/attendance-log-create', Authorization, AttendanceLogController.create);
// ###########################################  Roles   ##########################################

// Role Group
Router.post('/role-create',Authorization,  RoleController.create);
Router.get('/role-get', Authorization, RoleController.show);
Router.put('/role-update', Authorization, RoleController.update);
Router.delete('/role-delete', Authorization, RoleController.deletex);


// ###########################################   CANDIDATE   ##########################################

Router.post('/candidate-create', Authorization, CandidateController.create);
Router.get('/candidate-get', Authorization, CandidateController.show);
Router.put('/candidate-update', Authorization,CandidateController.update);
Router.delete('/candidate-delete', Authorization, CandidateController.deletex);
Router.get('/candidate-fetch', Authorization, CandidateController.fetch);
Router.post('/candidate-transfer', Authorization, CandidateController.transfer);



// ###########################################   Position   ##########################################

// Router.post('/position-create', Authorization, PositionController.create);
// Router.get('/position-get', Authorization, PositionController.show);
// Router.put('/position-update', Authorization, PositionController.update);
// Router.delete('/position-delete', Authorization, PositionController.deletex);


// ###########################################   INTERVIEW   ##########################################

Router.post('/interview-create', Authorization, InterviewReviewController.create);
Router.get('/interview-get', Authorization, InterviewReviewController.show);
// Router.put('/interview-update', Authorization, InterviewController.update);
// Router.delete('/interview-delete', Authorization, InterviewController.deletex);

// Interview-List

Router.post('/interview-list-create', Authorization, InterviewListController.create);
Router.get('/interview-list-get', Authorization, InterviewListController.show);
Router.put('/interview-list-update', Authorization, InterviewListController.update);
Router.delete('/interview-list-delete', Authorization, InterviewListController.deletex);

// Interview-Round

Router.post('/interview-round-create', Authorization,InterviewRoundController.create);
Router.get('/interview-round-get', Authorization, InterviewRoundController.show);
Router.put('/interview-round-update', Authorization, InterviewRoundController.update);
Router.delete('/interview-round-delete', Authorization, InterviewRoundController.deletex);


// Interview-Schedule

Router.post('/interview-schedule-create', Authorization,InterviewScheduleController.create);
Router.get('/interview-schedule-get', Authorization, InterviewScheduleController.show);
Router.put('/interview-schedule-update', Authorization, InterviewScheduleController.update);
Router.delete('/interview-schedule-delete', Authorization, InterviewScheduleController.deletex);



// ###########################################   Salary   ##########################################

Router.get('/salary-get', SalaryController.show);

// ###########################################   Position   ##########################################

Router.post('/shift-create', Authorization, ShiftController.create);

// ###########################################  Document Type   ##########################################
Router.post('/document-type-create',Authorization, DocumentTypeController.create);
Router.get('/document-type-get',Authorization, DocumentTypeController.show);
Router.put('/document-type-update',Authorization, DocumentTypeController.update);
Router.delete('/document-type-delete',Authorization, DocumentTypeController.deletex);

// ###########################################  User Document  ##########################################

Router.post("/upload-documents/:id", Authorization, cpUpload, UserDocumentController.imageupload);
Router.get("/documents-get/:id", UserDocumentController.show);
Router.get("/documents-view/:id", UserDocumentController.view);


Router.post('/interview-reschedule/:id', Authorization,InterviewScheduleController.reschedule);
Router.get('/interview-interviewDetail/:id', Authorization,InterviewReviewController.interviewDetail);
Router.get('/interview-getScheduled', Authorization,InterviewReviewController.getScheduled);







export default Router;