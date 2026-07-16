import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import {
    getAdminStats,
    getAllUsers,
    getAllCourses,
    getRecentEnrollments,
    assignCourse,
    getSystemPrompt,
    updateSystemPrompt,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/courses', getAllCourses);
router.get('/enrollments', getRecentEnrollments);
router.post('/assign', assignCourse);
router.get('/prompt', getSystemPrompt);
router.post('/prompt', updateSystemPrompt);

export default router;
