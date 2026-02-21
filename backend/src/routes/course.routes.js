import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { protect,restrictTo } from '../middleware/auth.middleware.js';
import { createCourse, getCourses } from '../controllers/course.controller.js';

const router=express.Router();

router.get('/',getCourses);

router.post('/',protect,restrictTo("mentor","admin"),createCourse);

export default router;