import express, { Router } from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { createCourse, deleteCourse, getAllCourses, getAllPublishedCourses, getCourseById, searchCourse, togglePublishCourse, updateCourse } from '../controllers/course.controller.js';
import upload from '../utils/multer.js'
import { createLecture ,getAllLectures,updateLecture,deleteLecture} from '../controllers/lecture.controller.js';


const courseRouter = express.Router();



courseRouter.route('/create').post(isAuthenticated, createCourse)
courseRouter.route('/search').post(isAuthenticated, searchCourse)
courseRouter.route('/get').get(isAuthenticated, getAllCourses)
courseRouter.route('/getPublish').get( getAllPublishedCourses)
courseRouter.route('/:courseId').get(isAuthenticated, getCourseById)
courseRouter.route('/publish/:courseId').put(isAuthenticated, togglePublishCourse)
courseRouter.route('/update/:courseId').put(isAuthenticated, upload.single("courseThumbnail"), updateCourse)
courseRouter.route('/delete/:courseId').delete(isAuthenticated, deleteCourse)

// Lecture Routes

courseRouter.route('/:courseId/lecture').post(isAuthenticated, createLecture);
courseRouter.route('/:courseId/getLectures').get(isAuthenticated, getAllLectures);
courseRouter.route('/:courseId/lecture/update/:lectureId').put(isAuthenticated, upload.single("video"),updateLecture)
courseRouter.route('/:courseId/lecture/delete/:lectureId').delete(isAuthenticated, deleteLecture)


export { courseRouter };