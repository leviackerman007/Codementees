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
    getEnrolledCourses,
    updateCourseSyllabus,
    updateCourseContent,
    addSyllabusItem,
    addContentItem

} from '../controllers/course.controller.js';

const router = express.Router();

// =======PUBLIC ROUTES========
router.get('/', getCourses);

// =======MENTOR ROUTES (BEFORE /:id)========
router.get('/mentor/my-courses', protect, restrictTo("mentor", "admin"), getMyCourses);

// =======STUDENT ROUTES========
router.get("/student/enrollments", protect, getEnrolledCourses);

// =======SPECIFIC COURSE (AFTER SPECIFIC ROUTES)========
router.get('/:id', getCourseById);

// =======MENTOR ONLY ROUTES========
router.post('/', protect, restrictTo("mentor", "admin"), createCourse);
router.patch("/:id", protect, restrictTo("mentor", "admin"), updateCourse);
router.delete("/:id", protect, restrictTo("mentor", "admin"), deleteCourse);
router.patch("/:id/toggle", protect, restrictTo("admin"), togglePublishedCourse);

// =======COURSE CONTENT & SYLLABUS========
router.patch("/:id/syllabus", protect, restrictTo("mentor", "admin"), updateCourseSyllabus);
router.patch("/:id/content", protect, restrictTo("mentor", "admin"), updateCourseContent);
router.post("/:id/syllabus/add", protect, restrictTo("mentor", "admin"), addSyllabusItem);
router.post("/:id/content/add", protect, restrictTo("mentor", "admin"), addContentItem);

// =======ENROLLMENT========
router.post("/:id/enroll", protect, enrollCourse);

export default router;