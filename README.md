# Realtime Chat API

A scalable and robust backend API for a real-time chat application, built with Node.js, Express, and MongoDB. This API provides the foundation for user authentication, real-time messaging using Socket.IO, and secure data storage.

## 🚀 Features

- **User Authentication:** Secure JWT-based authentication flow (Register & Login).
- **Password Security:** Passwords hashed safely using `bcrypt`.
- **Data Validation:** Request payload validation using `express-validator`.
- **Database:** MongoDB integration via Mongoose with strict schema validations.
- **Global Error Handling:** Centralized error-handling middleware for consistent API responses.
- **Real-time Capabilities:** (In Progress) Socket.IO integration for real-time room creation, online presence, and broadcasting messages.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** express-validator
- **Security:** bcrypt

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Git](https://git-scm.com/)

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on the provided `.env.example`. You will need to configure the following variables:

```env
PORT=3000

# MongoDB Configuration
MONGODB_USERNAME=your_db_username
MONGODB_PASSWORD=your_db_password
MONGODB_CLUSTER=your_cluster_url
MONGODB_APPNAME=your_app_name
MONGODB_DATABASENAME=chat_app_db

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key
JWT_EXPIRATION_TIME=7d
```

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/seifkhodr/realtime-api.git
   cd realtime-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run start
   ```
   The server will start using `nodemon` and listen on the configured port (default: `http://localhost:3000`).

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/v1/auth/register` | Register a new user | `firstName`, `lastName`, `age`, `email`, `password`, `avatar` (optional) |
| `POST` | `/api/v1/auth/login` | Authenticate an existing user | `email`, `password` |

*(Note: Additional endpoints for user management and chat rooms will be documented as they are fully implemented).*

## 🏗️ Architecture

For a deep dive into the application's design decisions, data flow, Socket.IO namespaces, and scaling considerations (like Redis pub/sub), please refer to the [`ARCHITECTURE.md`](./ARCHITECTURE.md) document included in this repository.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/seifkhodr/realtime-api/issues).

## 📝 License

This project is licensed under the [ISC License](./LICENSE).