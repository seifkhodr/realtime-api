import test from 'node:test';
import assert from 'node:assert/strict';
import messageSchema from '../src/schema/message.schema.js';

test('message timestamps expose the field used for ordering', () => {
    assert.ok(messageSchema.path('createdAt'));
    assert.equal(messageSchema.path('createAt'), undefined);
});
