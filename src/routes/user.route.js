import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import userController from '../controller/user.controller.js';
const router = express.Router();

router.get('/search', authMiddleware, userController.searchUsers);

export default router;