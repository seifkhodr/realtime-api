import { body, param } from 'express-validator';

const sendMessage = [
	body('conversationId')
		.isMongoId()
		.withMessage('Conversation id is not a valid MongoDB id'),
	body('content')
		.isString()
		.withMessage('Message content must be a string')
		.bail()
		.trim()
		.notEmpty()
		.withMessage('Message content is required')
];

const conversationMessages = [
	param('conversationId')
		.isMongoId()
		.withMessage('Conversation id is not a valid MongoDB id')
];

export default {
	sendMessage,
	conversationMessages
};
