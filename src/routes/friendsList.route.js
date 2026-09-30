import express from 'express';
import friendsListController from '../controller/friendsList.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validateFriendId from '../validator/friendsList.validator.js';
import validatiorMiddleware from '../middleware/validator.middleware.js';

const router = express.Router();

router.route('/')
    .get(authMiddleware,friendsListController.getFriends)

router.route('/:friendId')
    .post(authMiddleware,validateFriendId,validatiorMiddleware,friendsListController.addFriend)
    .delete(authMiddleware,validateFriendId,validatiorMiddleware,friendsListController.removeFriend)

export default router;