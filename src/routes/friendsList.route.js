import express from 'express';
import friendsListController from '../controller/friendsList.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validateFriendId from '../validator/friendsList.validator.js';
import validatorMiddleware from '../middleware/validator.middleware.js';
import validateAllowedField from '../middleware/allowedField.middleware.js';

const router = express.Router();

router.route('/')
    .get(authMiddleware,friendsListController.getFriends)

router.route('/:friendId')
    .post(
        authMiddleware,
        validateFriendId,
        validatorMiddleware,
        validateAllowedField([], { requireField: false }),
        friendsListController.addFriend
    )
    .delete(
        authMiddleware,
        validateFriendId,
        validatorMiddleware,
        validateAllowedField([], { requireField: false }),
        friendsListController.removeFriend
    )

export default router;