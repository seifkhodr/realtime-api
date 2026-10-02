import test from 'node:test';
import assert from 'node:assert/strict';
import {
    getPaginationParams,
    createPaginationMeta
} from '../src/utils/pagination.utils.js';

test('pagination parameters use safe defaults and cap the limit', () => {
    assert.deepEqual(getPaginationParams(), { page: 1, limit: 20 });
    assert.deepEqual(getPaginationParams({ page: '2', limit: '1000' }), { page: 2, limit: 50 });
    assert.deepEqual(getPaginationParams({ page: 'bad', limit: '-1' }), { page: 1, limit: 20 });
});

test('createPaginationMeta returns UI pagination metadata', () => {
    assert.deepEqual(createPaginationMeta(2, 2, 7), {
        page: 2,
        limit: 2,
        totalItems: 7,
        totalPages: 4,
        hasNextPage: true,
        hasPreviousPage: true
    });
});
