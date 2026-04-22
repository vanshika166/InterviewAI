import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { upload } from '../middlewares/multer.js';
import { analyseResume, generateQuestions, getInterviewData, interviewReport, submitAnswer, userInterviewList, userInterviewStats, Userprogress } from '../controllers/interviewController.js';

const interviewRoute = express.Router()

interviewRoute.post('/resume-analysis',isAuth,upload.single("resume") ,analyseResume);
interviewRoute.post("/generate-questions",isAuth,generateQuestions);
interviewRoute.post("/submit-answer",isAuth,submitAnswer);
interviewRoute.post("/interview-report",isAuth,interviewReport);
interviewRoute.post("/interview-data",isAuth,getInterviewData);
interviewRoute.post("/user-interview-list",isAuth,userInterviewList);
interviewRoute.post("/user-interview-stats",isAuth,userInterviewStats);
interviewRoute.post("/user-progress",isAuth,Userprogress);

export default interviewRoute;
