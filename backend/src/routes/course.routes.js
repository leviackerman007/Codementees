import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import {
    createCourse,
    getCourses,
    getCourseById,
    getMyCourses,
    togglePublishedCourse,
    deleteCourse,
    updateCourse,
    enrollCourse,
    getEnrolledCourses

} from '../controllers/course.controller.js';

const router = express.Router();

// =======PUBLIC ROUTES========
router.get('/', getCourses);
router.get('/:id', getCourseById);

// =======MENTOR ONLY ROUTES========
router.post('/', protect, restrictTo("mentor", "admin"), createCourse);
router.patch("/:id", protect, restrictTo("mentor", "admin"), updateCourse);
router.delete("/:id", protect, restrictTo("mentor", "admin"), deleteCourse);
router.patch("/:id/toggle", protect, restrictTo("mentor", "admin"), togglePublishedCourse);
router.get('/mentor/my-courses', protect, restrictTo("mentor", "admin"), getMyCourses);

// =======STUDENT ROUTES========
router.post("/:id/enroll",protect,enrollCourse);
router.get("/student/enrollments",protect,getEnrolledCourses);

export default router;