import express from 'express';
import messageController from '../controller/message.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validatorMiddleware from '../middleware/validator.middleware.js';
import validateAllowedField from '../middleware/allowedField.middleware.js';
import allowedFields from '../utils/enums/allowedFields.js';
import chatValidator from '../validator/chat.validator.js';

const router = express.Router();

router.route('/')
    .post(
        authMiddleware,
        chatValidator.sendMessage,
        validatorMiddleware,
        validateAllowedField(allowedFields.messageFields.create),
        messageController.sendMessage
    )

router.route('/:conversationId')
    .get(
        authMiddleware,
        chatValidator.conversationMessages,
        validatorMiddleware,
        messageController.getMessages
    )

export default router;