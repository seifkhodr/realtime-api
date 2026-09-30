import { param } from 'express-validator';

const validateFriendId = [
    param('friendId')
        .isMongoId()
        .withMessage('friend Id is not a valid mongoDB id')
];

export default validateFriendId;