import { body, param } from 'express-validator';

const createConversation = [
	body('type')
		.isIn(['direct', 'group'])
		.withMessage('Conversation type must be direct or group'),
	body('name')
		.optional({ values: 'null' })
		.isString()
		.withMessage('Conversation name must be a string')
		.trim(),
	body('participants')
		.isArray()
		.withMessage('Participants must be an array')
		.bail()
		.custom((participants) => participants.every((participant) =>
			/^[a-f\d]{24}$/i.test(participant)
		))
		.withMessage('Participants must contain valid MongoDB ids')
];

const conversationId = [
	param('conversationId')
		.isMongoId()
		.withMessage('Conversation id is not a valid MongoDB id')
];

const addParticipant = [
	...conversationId,
	body('participantId')
		.isMongoId()
		.withMessage('Participant id is not a valid MongoDB id')
];

const removeParticipant = [
	...conversationId,
	param('participantId')
		.isMongoId()
		.withMessage('Participant id is not a valid MongoDB id')
];

export default {
	createConversation,
	conversationId,
	addParticipant,
	removeParticipant
};
