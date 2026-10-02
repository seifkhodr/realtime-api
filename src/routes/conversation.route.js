import express from 'express';
import conversationController from '../controller/converstation.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validatorMiddleware from '../middleware/validator.middleware.js';
import validateAllowedField from '../middleware/allowedField.middleware.js';
import conversationValidator from '../validator/conversation.validator.js';
import allowedFields from '../utils/enums/allowedFields.js';

const router = express.Router();

// BUG-FIX BUG-01: POST route was missing validateAllowedField, so req.data was undefined in the controller
router.route('/')
    .get(authMiddleware, conversationController.getConversations)
    .post(
        authMiddleware,
        conversationValidator.createConversation,
        validatorMiddleware,
        validateAllowedField(allowedFields.conversationFields.create),
        conversationController.createConversation
    );

router.route('/:conversationId')
    .get(
        authMiddleware,
        conversationValidator.conversationId,
        validatorMiddleware,
        conversationController.getConversationById
    );
    // .delete(authMiddleware, validatorMiddleware, conversationController.deleteConversation)

router.route('/:conversationId/participants')
    .post(
        authMiddleware,
        conversationValidator.addParticipant,
        validatorMiddleware,
        validateAllowedField(allowedFields.conversationFields.addParticipant),
        conversationController.addParticipant
    );

// BUG-FIX BUG-08: was missing leading / on the route pattern
router.route('/:conversationId/participants/:participantId')
    .delete(
        authMiddleware,
        conversationValidator.removeParticipant,
        validatorMiddleware,
        conversationController.removeParticipant
    );

export default router;
