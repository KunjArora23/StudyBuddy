import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import {
  updateCourseProgress,
  getCourseProgress,
  markCourseAsCompleted,
  markCourseAsInCompleted
} from '../controllers/courseProgess.controller.js';

const router = express.Router();

router.route('/:courseId').get(isAuthenticated, getCourseProgress);
router.route('/:courseId/lecture/:lectureId/view').post(isAuthenticated, updateCourseProgress);
router.route('/:courseId/complete').post(isAuthenticated, markCourseAsCompleted);
router.route('/:courseId/incomplete').post(isAuthenticated, markCourseAsInCompleted);

export default router;
