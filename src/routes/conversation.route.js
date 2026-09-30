import express from 'express';
import conversationController from '../controller/converstation.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validatorMiddleware from '../middleware/validator.middleware.js';

const router = express.Router();

router.route('/')
    .get(authMiddleware,conversationController.getConversations)
    .post(authMiddleware,conversationController.createConversation)

router.route('/:conversationId')
    .get(authMiddleware,validatorMiddleware,conversationController.getConversationById)
    // .delete(authMiddleware,validatorMiddleware,conversationController.deleteConversation)

router.route('/:conversationId/participants')
    .post(authMiddleware,validatorMiddleware,conversationController.addParticipant)


router.route(':conversationId/participants/:participantId')
    .delete(authMiddleware,validatorMiddleware,conversationController.removeParticipant)


export default router;

