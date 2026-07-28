# AdaptiveAI

AdaptiveAI is an intelligent, microservice-driven examination platform. It leverages a modern tech stack to provide adaptive testing, AI-powered descriptive answer grading, plagiarism detection, and comprehensive performance analytics.

The project is structured as a monorepo containing a Vite + React frontend and a Node.js + Express backend API Gateway.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion
- **State Management**: Redux Toolkit & React Query
- **Routing**: React Router DOM
- **Forms & Validation**: React Hook Form + Zod

### Backend (API Gateway)
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Cache & Queues**: Redis & BullMQ
- **Real-time**: Socket.IO
- **Authentication**: JWT & Passport.js (RBAC enabled)
- **Validation**: Zod
- **Documentation**: Swagger / OpenAPI 3.0

## 📂 Project Structure

```text
AdaptiveAi/
├── src/                  # Frontend React source code
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   └── store/            # Redux store & slices
├── server/               # Backend Node.js API Gateway
│   ├── src/
│   │   ├── config/       # Environment, DB, Redis, Swagger configs
│   │   ├── controllers/  # Route handlers
│   │   ├── events/       # Socket.IO handlers
│   │   ├── jobs/         # BullMQ background workers (grading, etc.)
│   │   ├── middleware/   # Auth, RBAC, Rate Limiting, Error Handling
│   │   ├── models/       # Mongoose Schemas (User, Question, ExamSession, etc.)
│   │   ├── routes/       # Express API routes
│   │   ├── services/     # Core logic and Microservice HTTP clients
│   │   ├── utils/        # Helpers, Logger (Winston)
│   │   └── validators/   # Zod validation schemas
│   ├── .env.example      # Backend environment variables
│   └── package.json      # Backend dependencies
├── package.json          # Frontend dependencies
└── vite.config.js        # Vite bundler config
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB (Running locally on default port 27017 or provided via `.env`)
- *Note: Redis is required for production (Rate Limiting, BullMQ), but for local development (`NODE_ENV=development`), it is automatically mocked in-memory so you do not need to install it.*

### 1. Start the Backend Server

The backend runs on Port 5000 and requires its own dependencies to be installed.
Open a terminal and run:

```bash
cd server
npm install
npm run dev
```

*When successful, you will see `Server is running in development mode on port 5000` in the terminal.*
*The interactive API documentation is available at `http://localhost:5000/api-docs`*

### 2. Start the Frontend Application

Open a **new, separate terminal window**, ensure you are in the root directory (`AdaptiveAi`), and run:

```bash
npm install
npm run dev
```

*The frontend application will boot up and be accessible in your browser at `http://localhost:5173`*

## 🧠 Backend Architecture

The Node.js backend serves as the central orchestrator (`API Gateway`) for the platform. 
It securely handles user authentication (JWT + Role-Based Access Control) and connects to three Python AI Microservices:
1. **Adaptive Engine**: Estimates student ability (IRT) and dynamically selects the next best question.
2. **NLP Engine**: Grades descriptive answers based on rubrics and checks for plagiarism.
3. **Analytics Engine**: Clusters students, predicts performance, and generates actionable study recommendations.

Background-intensive tasks (such as AI grading) are offloaded to **BullMQ** workers to ensure non-blocking HTTP responses, while **Socket.IO** emits real-time grading updates and examination monitoring telemetry.
