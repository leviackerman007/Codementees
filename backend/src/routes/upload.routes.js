import express from 'express';
import * as uploadController from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// POST /api/upload/cloudinary
router.post('/cloudinary', uploadController.uploadToCloudinary);

// DELETE /api/upload/cloudinary/delete
router.delete('/cloudinary/delete', uploadController.deleteFromCloudinary);

// GET /api/upload/cloudinary/signature
router.get('/cloudinary/signature', uploadController.getSignedUploadParams);

export default router;
