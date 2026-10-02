# ⚡ Realtime Chat API

<div align="center">

**A production-grade, scalable backend for real-time chat** — built with Node.js, Express, MongoDB, Socket.IO & Redis Pub/Sub.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Planned-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Redis](https://img.shields.io/badge/Redis-Pub%2FSub-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./LICENSE)

</div>

---

## 📖 Overview

This is the backend REST + WebSocket API for a feature-rich real-time chat application. The architecture is designed from the ground up to scale horizontally — using **Redis Pub/Sub** to bridge multiple server instances and **Socket.IO** namespaces to deliver events to clients in real time.

The current phase covers a fully functional **REST API** (auth, conversations, messages, friends). The next phase wires in **Socket.IO** and **Redis** to make all of it live.

---

## ✅ Current Status

| Layer                                  | Status         |
| -------------------------------------- | -------------- |
| User Authentication (JWT)              | ✅ Complete    |
| Password Hashing (bcrypt)              | ✅ Complete    |
| Request Validation (express-validator) | ✅ Complete    |
| MongoDB / Mongoose Models              | ✅ Complete    |
| Conversations (direct + group)         | ✅ Complete    |
| Messages (send + fetch)                | ✅ Complete    |
| Friends List                           | ✅ Complete    |
| Global Error Handling                  | ✅ Complete    |
| Socket.IO Integration                  | 🚧 In Progress |
| Redis Pub/Sub                          | 🚧 In Progress |
| Online Presence & Read Receipts        | 📋 Planned     |
| Rate Limiting & Helmet                 | 📋 Planned     |
| Automated Tests                        | 🚧 In Progress |

---

## 🚀 Features

### 🔐 Authentication & Security

- **JWT-based auth** — stateless, signed tokens with configurable expiration
- **bcrypt** password hashing — industry-standard salted hashing
- **Allowed-field middleware** — strips unknown fields from request bodies to prevent mass assignment attacks
- **Centralized error handler** — consistent JSON error responses across the entire API

### 💬 Chat System

- **Direct conversations** — 1-on-1 messaging with deduplication (no duplicate DM conversations)
- **Group conversations** — named groups with owner-gated participant management
- **Add / Remove participants** — owner-gated group management
- **Message history** — paginated message retrieval sorted by `createdAt`
- **`lastMessage` denormalization** — stores the latest message reference on conversations

### 👥 Social

- **Friends list** — add, view, and manage friend connections

### 🏗️ Architecture & Scale (Planned)

- **Socket.IO namespaces** — `/chat` and `/notifications` namespaces with room-scoped events
- **Redis Pub/Sub** — broadcasts events across multiple server instances (horizontal scaling)
- **Online presence** — `status` and `lastSeen` updated on socket connect/disconnect
- **Read receipts** — `lastReadMessageId` per participant, zero extra DB writes per message

---

## 🛠️ Tech Stack

| Category                      | Technology              |
| ----------------------------- | ----------------------- |
| Runtime                       | Node.js (ESM modules)   |
| Framework                     | Express.js v5           |
| Database                      | MongoDB via Mongoose v9 |
| Authentication                | JSON Web Tokens (JWT)   |
| Validation                    | express-validator       |
| Security                      | bcrypt                  |
| Real-time _(Next Phase)_      | Socket.IO               |
| Pub/Sub Broker _(Next Phase)_ | Redis                   |
| Process Manager               | nodemon                 |

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) v18+ (LTS recommended)
- [MongoDB](https://www.mongodb.com/) — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- [Git](https://git-scm.com/)
- _(Phase 2)_ [Redis](https://redis.io/) — local instance or [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/)

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
# Server
PORT=3000

# MongoDB
MONGODB_USERNAME=your_db_username
MONGODB_PASSWORD=your_db_password
MONGODB_CLUSTER=your_cluster_url
MONGODB_APPNAME=your_app_name
MONGODB_DATABASENAME=chat_app_db

# JWT
JWT_SECRET_KEY=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRATION_TIME=30m
JWT_REFRESH_SECRET_KEY=your_refresh_secret_key_min_32_chars
JWT_REFRESH_TOKEN_EXPIRY_TIME=7d

# Redis (Phase 2)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/seifkhodr/realtime-api.git
cd realtime-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# → Edit .env with your MongoDB connection details and JWT secret

# 4. Start the development server
npm run start
```

The API will be available at `http://localhost:3000`.
Health check: `GET http://localhost:3000/health`

---

## 📡 API Reference

All routes are prefixed with `/api/v1`. Protected routes use the HTTP-only `accessToken` cookie. The `Authorization: Bearer <token>` header is also accepted for compatibility.

### 🔐 Auth

| Method | Endpoint         | Auth | Description             |
| ------ | ---------------- | ---- | ----------------------- |
| `POST` | `/auth/register` | ❌   | Register a new user     |
| `POST` | `/auth/login`    | ❌   | Login and receive a JWT |
| `POST` | `/auth/refresh`  | ❌   | Refresh access and refresh cookies |
| `POST` | `/auth/logout`   | ❌   | Clear authentication cookies |

**Register body:**

```json
{
  "firstName": "Seif",
  "lastName": "Khodr",
  "age": 22,
  "email": "seif@example.com",
  "password": "securepassword",
  "avatar": "https://example.com/avatar.png"
}
```

**Login body:**

```json
{
  "email": "seif@example.com",
  "password": "securepassword"
}
```

---

### 👥 Friends

| Method   | Endpoint             | Auth | Description                         |
| -------- | -------------------- | ---- | ----------------------------------- |
| `GET`    | `/friends`           | ✅   | Get the current user's friends list |
| `POST`   | `/friends/:friendId` | ✅   | Add a friend                        |
| `DELETE` | `/friends/:friendId` | ✅   | Remove a friend                     |

---

### 💬 Conversations

| Method   | Endpoint                                                     | Auth | Description                                |
| -------- | ------------------------------------------------------------ | ---- | ------------------------------------------ |
| `GET`    | `/conversations`                                             | ✅   | Get all conversations for the current user |
| `POST`   | `/conversations`                                             | ✅   | Create a new direct or group conversation  |
| `GET`    | `/conversations/:conversationId`                             | ✅   | Get a specific conversation by ID          |
| `POST`   | `/conversations/:conversationId/participants`                | ✅   | Add a participant to a group               |
| `DELETE` | `/conversations/:conversationId/participants/:participantId` | ✅   | Remove a participant (owner only)          |

**Create conversation body (direct):**

```json
{
  "type": "direct",
  "participants": ["<userId>"]
}
```

**Create conversation body (group):**

```json
{
  "type": "group",
  "name": "Project Team",
  "participants": ["<userId1>", "<userId2>"]
}
```

---

### 📨 Messages

| Method | Endpoint                    | Auth | Description                      |
| ------ | --------------------------- | ---- | -------------------------------- |
| `POST` | `/messages`                 | ✅   | Send a message to a conversation |
| `GET`  | `/messages/:conversationId` | ✅   | Get paginated message history    |

**Send message body:**

```json
{
  "conversationId": "<conversationId>",
  "content": "Hey there!"
}
```

Message history supports pagination:

```http
GET /messages/<conversationId>?page=1&limit=20
```

The response contains `data` and `pagination` metadata. The maximum page size is 50, and messages are ordered by `createdAt`.

---

## 🏗️ Project Structure

```
realtime-api/
├── app.js                    # Express app — routes, middleware, error handler
├── server.js                 # HTTP server bootstrap & DB connection
│
└── src/
    ├── config/               # DB connection, env config
    ├── controller/           # Route handlers (thin layer, delegates to services)
    ├── service/              # Business logic
    ├── model/                # Mongoose schemas & models
    ├── routes/               # Express route definitions
    ├── middleware/            # Auth, validation, error handling, allowed fields
    ├── validator/            # express-validator chains per route
    ├── schema/               # Shared validation schema definitions
    ├── utils/                # Enums, helpers, custom error classes
    ├── events/               # Internal event bus (Node.js EventEmitter)
    ├── socket/               # Socket.IO server setup (Phase 2)
    └── redis/                # Redis publisher, subscriber, channels (Phase 2)
```

---

## 🔮 Roadmap

### Phase 2 — Real-time Engine (Socket.IO + Redis)

- [ ] Initialize Socket.IO server on top of the existing HTTP server
- [ ] JWT authentication middleware for socket handshake
- [ ] `/chat` namespace — join rooms, send messages, typing indicators
- [ ] `/notifications` namespace — friend requests, system events
- [ ] Online presence (`status`, `lastSeen`) updated on connect/disconnect
- [ ] Read receipts via `lastReadMessageId` per participant
- [ ] Redis Pub/Sub bridge for multi-instance horizontal scaling

### Phase 3 — Production Hardening

- [ ] Rate limiting (`express-rate-limit`)
- [ ] Security headers (`helmet`)
- [ ] Request logging (`morgan` / `winston`)
- [ ] Full test suite (Jest + Supertest)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker + `docker-compose` setup
- [ ] Deployment guide (Railway / Render / EC2)

> 📄 See [`socketImp.md`](./socketImp.md) for the detailed Socket.IO + Redis implementation plan.
> 📄 See [`DATABASE_ARCHITECTURE.md`](./DATABASE_ARCHITECTURE.md) for the full data model & ERD.

---

## 🗄️ Database Design

The schema is purpose-built for a scalable chat app. Key design decisions:

- **Messages are a separate collection** — never embedded in conversation documents (avoids MongoDB's 16MB doc limit)
- **`lastMessage` on conversations** — stores the latest message reference
- **`lastReadMessageId` per participant** — read receipts with zero extra writes per message
- **Compound index** `{ conversationId: 1, createdAt: 1, _id: 1 }` on messages — stable paginated history

See [`DATABASE_ARCHITECTURE.md`](./DATABASE_ARCHITECTURE.md) for the full ERD and schema reference.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Check the [issues page](https://github.com/seifkhodr/realtime-api/issues) for open tasks.

---

## 📝 License

This project is licensed under the [ISC License](./LICENSE).

---

<div align="center">Built by <a href="https://github.com/seifkhodr">seifkhodr</a> 🚀</div>
