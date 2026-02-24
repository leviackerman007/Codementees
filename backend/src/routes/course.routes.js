import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { createCourse, getCourses, getMyCourses,togglePublisherCourse,deleteCourse } from '../controllers/course.controller.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/', protect, restrictTo("mentor", "admin"), createCourse);
router.patch("/:id/toggle",protect,restrictTo("mentor","admin"),togglePublisherCourse);
router.delete("/:id",protect,restrictTo("mentor","admin"),deleteCourse);
router.get('/my-courses', protect, restrictTo("mentor", "admin"), getMyCourses);


export default router;