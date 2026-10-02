import test from 'node:test';
import assert from 'node:assert/strict';
import userSchema from '../src/schema/user.schema.js';
import messageSchema from '../src/schema/message.schema.js';

test('users default to the client role and allow admin users', () => {
    const rolePath = userSchema.path('role');

    assert.equal(rolePath.defaultValue, 'client');
    assert.deepEqual(rolePath.enumValues, ['client', 'admin']);
});

test('messages have an index for ordered conversation history', () => {
    const indexes = messageSchema.indexes();
    assert.ok(indexes.some(([fields]) =>
        fields.conversationId === 1 &&
        fields.createdAt === 1 &&
        fields._id === 1
    ));
});
