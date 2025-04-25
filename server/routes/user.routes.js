import express, { Router } from 'express'
import { enrollCourseAfterPayment, getUserProfile, instructorDashboardStats, login, logout, register, updateProfile } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import upload from '../utils/multer.js'

const userRouter = express.Router();



userRouter.route('/register').post(register)
userRouter.route('/login').post(login)
userRouter.route('/getProfile').get(isAuthenticated, getUserProfile)
userRouter.route('/dashboard-stats').get(isAuthenticated, instructorDashboardStats)
userRouter.route('/logout').get(isAuthenticated, logout)
userRouter.route('/enroll-course').post(isAuthenticated, enrollCourseAfterPayment)
userRouter.route("/update").put(isAuthenticated, upload.single("avatar"), updateProfile);

export { userRouter };