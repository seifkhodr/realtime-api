const API_BASE = "/api/v1";

/**
 * ApiBuilder — fluent builder pattern for all backend endpoints.
 *
 * Usage:
 *   const api = new ApiBuilder({ token });
 *   api.auth.login({ email, password })
 *   api.auth.register({ firstName, lastName, email, password, age })
 *   api.users.search(query)
 *   api.friends.getAll()
 *   api.friends.add(friendId)
 *   api.friends.remove(friendId)
 *   api.conversations.getAll()
 *   api.conversations.getById(id)
 *   api.conversations.createDirect(participantId)
 *   api.conversations.createGroup(name, participantIds)
 *   api.conversations.addParticipant(conversationId, participantId)
 *   api.conversations.removeParticipant(conversationId, participantId)
 *   api.messages.getByConversation(conversationId)
 *   api.messages.send(conversationId, content)
 */
export default class ApiBuilder {
  constructor({ token = null } = {}) {
    this.token = token;
    this.auth = new AuthEndpoints(this);
    this.users = new UserEndpoints(this);
    this.friends = new FriendEndpoints(this);
    this.conversations = new ConversationEndpoints(this);
    this.messages = new MessageEndpoints(this);
  }

  /**
   * Core fetch wrapper. Throws on non-2xx. Unwraps JSend envelope.
   * @param {string} path
   * @param {RequestInit & { skipAuth?: boolean }} options
   */
  async _request(path, options = {}) {
    const headers = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(!options.skipAuth && this.token
        ? { Authorization: `Bearer ${this.token}` }
        : {}),
      ...(options.headers ?? {}),
    };

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    let json;
    try { json = await res.json(); } catch { json = {}; }

    if (!res.ok) {
      const msg =
        json?.message ||
        (Array.isArray(json?.data)
          ? json.data.map((e) => e.message).join(", ")
          : null) ||
        `Request failed (${res.status})`;
      throw new Error(msg);
    }

    // Unwrap JSend { status: "success", data: ... }
    return json?.data ?? json;
  }
}

// ── Auth ────────────────────────────────────────────────────────────────────
class AuthEndpoints {
  constructor(api) { this._api = api; }

  /** POST /auth/login → { user, token } */
  login(credentials) {
    return this._api._request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      skipAuth: true,
    });
  }

  /** POST /auth/register → { user, token } */
  register(details) {
    return this._api._request("/auth/register", {
      method: "POST",
      body: JSON.stringify(details),
      skipAuth: true,
    });
  }
}

// ── Users ───────────────────────────────────────────────────────────────────
class UserEndpoints {
  constructor(api) { this._api = api; }

  /** GET /users/search?q=... → user[] */
  search(query) {
    return this._api._request(`/users/search?q=${encodeURIComponent(query)}`);
  }
}

// ── Friends ─────────────────────────────────────────────────────────────────
class FriendEndpoints {
  constructor(api) { this._api = api; }

  /** GET /friends → { userId, friends[] } | null */
  getAll() {
    return this._api._request("/friends");
  }

  /** POST /friends/:friendId → friendsList doc */
  add(friendId) {
    return this._api._request(`/friends/${friendId}`, { method: "POST" });
  }

  /** DELETE /friends/:friendId → friendsList doc */
  remove(friendId) {
    return this._api._request(`/friends/${friendId}`, { method: "DELETE" });
  }
}

// ── Conversations ────────────────────────────────────────────────────────────
class ConversationEndpoints {
  constructor(api) { this._api = api; }

  /** GET /conversations → conversation[] */
  getAll() {
    return this._api._request("/conversations");
  }

  /** GET /conversations/:id → conversation */
  getById(conversationId) {
    return this._api._request(`/conversations/${conversationId}`);
  }

  /** POST /conversations — type:direct → conversation */
  createDirect(participantId) {
    return this._api._request("/conversations", {
      method: "POST",
      body: JSON.stringify({ type: "direct", participants: [participantId] }),
    });
  }

  /** POST /conversations — type:group → conversation */
  createGroup(name, participantIds) {
    return this._api._request("/conversations", {
      method: "POST",
      body: JSON.stringify({ type: "group", name, participants: participantIds }),
    });
  }

  /** POST /conversations/:id/participants → conversation */
  addParticipant(conversationId, participantId) {
    return this._api._request(`/conversations/${conversationId}/participants`, {
      method: "POST",
      body: JSON.stringify({ participantId }),
    });
  }

  /** DELETE /conversations/:id/participants/:pid → conversation */
  removeParticipant(conversationId, participantId) {
    return this._api._request(
      `/conversations/${conversationId}/participants/${participantId}`,
      { method: "DELETE" }
    );
  }
}

// ── Messages ─────────────────────────────────────────────────────────────────
class MessageEndpoints {
  constructor(api) { this._api = api; }

  /** GET /messages/:conversationId → message[] */
  getByConversation(conversationId) {
    return this._api._request(`/messages/${conversationId}`);
  }

  /** POST /messages → message */
  send(conversationId, content) {
    return this._api._request("/messages", {
      method: "POST",
      body: JSON.stringify({ conversationId, content }),
    });
  }
}
