import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { getAdminStats, getAllUsers, getAllCourses } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/courses', getAllCourses);

export default router;
