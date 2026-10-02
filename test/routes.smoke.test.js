import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../app.js';

let httpServer;
let baseUrl;

before(async () => {
    httpServer = http.createServer(app);
    await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
    const { port } = httpServer.address();
    baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        httpServer.close((error) => error ? reject(error) : resolve());
    });
});

async function request(path, options = {}) {
    return fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers
        }
    });
}

test('health endpoint responds successfully', async () => {
    const response = await request('/health');

    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'ok');
});

test('auth validation rejects empty registration and login payloads', async () => {
    const registrationResponse = await request('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({})
    });
    const loginResponse = await request('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({})
    });

    assert.equal(registrationResponse.status, 422);
    assert.equal(loginResponse.status, 422);
});

test('refresh requires a refresh cookie and logout clears without authentication', async () => {
    const refreshResponse = await request('/api/v1/auth/refresh', { method: 'POST' });
    const logoutResponse = await request('/api/v1/auth/logout', { method: 'POST' });

    assert.equal(refreshResponse.status, 401);
    assert.equal(logoutResponse.status, 204);
});

test('protected conversation routes reject unauthenticated requests', async () => {
    const responses = await Promise.all([
        request('/api/v1/conversations'),
        request('/api/v1/conversations', { method: 'POST', body: JSON.stringify({}) }),
        request('/api/v1/conversations/not-an-id'),
        request('/api/v1/conversations/not-an-id/participants', {
            method: 'POST',
            body: JSON.stringify({})
        }),
        request('/api/v1/conversations/not-an-id/participants/not-an-id', {
            method: 'DELETE'
        })
    ]);

    assert.deepEqual(responses.map(({ status }) => status), [401, 401, 401, 401, 401]);
});

test('protected message routes reject unauthenticated requests', async () => {
    const responses = await Promise.all([
        request('/api/v1/messages', {
            method: 'POST',
            body: JSON.stringify({})
        }),
        request('/api/v1/messages/not-an-id')
    ]);

    assert.deepEqual(responses.map(({ status }) => status), [401, 401]);
});

test('protected friend and user routes reject unauthenticated requests', async () => {
    const responses = await Promise.all([
        request('/api/v1/friends'),
        request('/api/v1/friends/not-an-id', { method: 'POST' }),
        request('/api/v1/friends/not-an-id', { method: 'DELETE' }),
        request('/api/v1/users/search?q=alice')
    ]);

    assert.deepEqual(responses.map(({ status }) => status), [401, 401, 401, 401]);
});

test('unknown routes return not found', async () => {
    const response = await request('/api/v1/does-not-exist');

    assert.equal(response.status, 404);
});
