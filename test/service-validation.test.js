import test from 'node:test';
import assert from 'node:assert/strict';
import conversationService from '../src/service/conversation.service.js';
import friendsListService from '../src/service/friendsList.service.js';

test('conversation creation rejects a self-directed direct conversation', async () => {
    const userId = '507f1f77bcf86cd799439011';

    await assert.rejects(
        conversationService.createConversation(userId, {
            type: 'direct',
            participants: [userId]
        }),
        error => error.statusCode === 400 && error.message.includes('yourself')
    );
});

test('conversation creation rejects duplicate participants', async () => {
    await assert.rejects(
        conversationService.createConversation('507f1f77bcf86cd799439011', {
            type: 'group',
            participants: [
                '507f1f77bcf86cd799439012',
                '507f1f77bcf86cd799439012'
            ]
        }),
        error => error.statusCode === 400 && error.message.includes('unique')
    );
});

test('friends service rejects adding yourself', async () => {
    const userId = '507f1f77bcf86cd799439011';

    await assert.rejects(
        friendsListService.addFriend(userId, userId),
        error => error.statusCode === 400 && error.message.includes('yourself')
    );
});
