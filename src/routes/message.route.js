import express from 'express';
import messageController from '../controller/message.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validatorMiddleware from '../middleware/validator.middleware.js';

const router = express.Router();

router.route('/')
    .post(authMiddleware,validatorMiddleware,messageController.sendMessage)

router.route('/:conversationId')
    .get(authMiddleware,validatorMiddleware,messageController.getMessages)

export default router;