import test from 'node:test';
import assert from 'node:assert/strict';
import getEnv from '../src/config/env.config.js';

test('environment helper trims values and supports defaults', () => {
    const key = 'TEST_ENV_CONFIG_VALUE';
    process.env[key] = '  configured  ';

    assert.equal(getEnv(key), 'configured');
    assert.equal(getEnv('TEST_ENV_CONFIG_MISSING', 'fallback'), 'fallback');

    delete process.env[key];
});

test('environment helper throws for missing required values', () => {
    assert.throws(
        () => getEnv('TEST_ENV_CONFIG_REQUIRED_MISSING'),
        error => error.statusCode === 500 && error.isOperational === true
    );
});
