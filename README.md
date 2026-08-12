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
Student:
Explain deadlock in Operating Systems.

AdaptiveAI:
A deadlock occurs when multiple processes are permanently
waiting for resources held by each other...

The AI assistant acts as an always-available academic companion.

Students can use it for:

Concept clarification
Programming doubts
Computer Science subjects
Exam preparation
Technical explanations
General academic questions
🔥 AI Daily Challenge

Every day, students receive a short challenge designed to encourage consistent learning.

Example:

╔════════════════════════════════════╗
║        ⚡ TODAY'S CHALLENGE        ║
║                                    ║
║ Topic: Algorithms                  ║
║ Difficulty: Medium                ║
║ Time: 90 seconds                   ║
║                                    ║
║ Can you solve this?                ║
║                                    ║
║       [ Start Challenge ]          ║
╚════════════════════════════════════╝

After completion:

🔥 Correct!

Score: 10/10

🔥 7 Day Streak

This introduces gamification and encourages students to maintain a consistent learning habit.

🎯 AI Study Recommendations

AdaptiveAI analyzes examination performance and identifies areas where the student can improve.

Example:

┌─────────────────────────────────────┐
│ 🎯 AI RECOMMENDATION                │
│                                     │
│ Strengthen Operating Systems        │
│                                     │
│ Your recent accuracy in OS is low. │
│                                     │
│ Recommended:                        │
│                                     │
│ • Review Deadlocks                  │
│ • Practice 10 questions             │
│ • Take an OS practice exam          │
│                                     │
│        [ Start Practice ]            │
└─────────────────────────────────────┘

Recommendations can be based on:

Exam history
Question accuracy
Subject performance
Topic performance
Difficulty performance
Weak areas
Strong areas
📅 Today's Study Plan

AdaptiveAI can provide students with a personalized daily study plan.

Example:

┌─────────────────────────────────────┐
│ 🎯 TODAY'S STUDY PLAN               │
│                                     │
│ Goal: 30 minutes                    │
│                                     │
│ ☑ Daily Challenge          5 min    │
│ ☐ Operating Systems       15 min    │
│ ☐ DBMS Practice           10 min    │
│                                     │
│ Progress                        40% │
│ ████████░░░░░░░░░░░░               │
│                                     │
│        [ Continue Plan → ]          │
└─────────────────────────────────────┘

This connects:

Daily Challenge + AI Recommendations + Exam Practice

into one personalized learning workflow.

📈 Performance Analytics

AdaptiveAI provides detailed performance insights instead of showing only a final score.

Analytics can include:

Exam performance
Average score
Accuracy
Subject-wise performance
Topic-wise performance
Difficulty performance
Historical trends
Strong areas
Weak areas
Improvement percentage

Example:

📈 PERFORMANCE TREND

Your last 5 exams

90% ┤                    ●
80% ┤               ●
70% ┤          ●
60% ┤     ●
50% ┤ ●
    └────────────────────
      E1 E2 E3 E4 E5

↑ 18% improvement
👁️ Examination Integrity Monitoring

AdaptiveAI provides browser-based examination monitoring capabilities.

The platform can monitor examination-related events such as:

👥 Multiple-person detection
👀 Looking-away detection
🔄 Tab-switching detection
🖥️ Fullscreen monitoring
📊 Live integrity scoring

These events can contribute to an examination integrity score.

Note: Monitoring signals are assistive indicators and should not be treated as a perfect or standalone determination of misconduct.

📜 Smart Certificates

AdaptiveAI can generate digital certificates for successful examination completion.

Certificates can include:

Student name
Examination name
Score
Completion date
Certificate ID
QR verification

The QR code can be used to verify certificate authenticity.

⚡ Real-Time Examination System

AdaptiveAI uses Socket.IO for real-time communication between the frontend and backend.

Real-time functionality can support:

Live grading updates
Examination events
Integrity alerts
Session updates
Background task status
Examination telemetry
🔐 Security

Security is an important part of the AdaptiveAI architecture.

The backend uses:

🔑 JWT Authentication
👤 Role-Based Access Control
🛡️ Passport.js
🔒 Password Hashing
🪖 Helmet
🚦 Rate Limiting
✅ Zod Validation
🔐 Protected API Routes
🧹 Secure Input Validation
🤖 AI Capabilities

AdaptiveAI combines multiple AI-powered components.

AI System	Purpose
🎯 Adaptive Engine	Selects appropriate questions
🤖 NLP / Grading Engine	Evaluates descriptive answers
🧠 AI Doubt Solver	Answers academic doubts
📊 Analytics Engine	Generates performance insights
🎯 Recommendation Engine	Suggests improvement areas
🔥 Daily Challenge Engine	Provides daily learning challenges
🏗️ Architecture

AdaptiveAI follows a microservice-oriented architecture with a Node.js and Express API Gateway.

                         ┌──────────────────────┐
                         │       STUDENT        │
                         │       BROWSER        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   REACT FRONTEND     │
                         │    Vite + React      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     API GATEWAY      │
                         │ Node.js + Express    │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
      │ Adaptive AI   │     │ NLP / Grading │     │ Analytics AI  │
      │    Engine     │     │    Engine     │     │    Engine     │
      └───────────────┘     └───────────────┘     └───────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       MongoDB        │
                         │   Application Data   │
                         └──────────────────────┘

                         ┌──────────────────────┐
                         │    Redis + BullMQ    │
                         │ Background Workers   │
                         └──────────────────────┘

                         ┌──────────────────────┐
                         │      Socket.IO       │
                         │   Real-Time Events   │
                         └──────────────────────┘
🧩 System Workflow
                         STUDENT
                            │
                            ▼
                     ┌─────────────┐
                     │    LOGIN    │
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  DASHBOARD  │
                     └──────┬──────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    AI Doubt Solver   Daily Challenge   Study Plan
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                      ┌───────────┐
                      │   EXAM    │
                      └─────┬─────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Question Engine  │
                  └────────┬─────────┘
                           │
                           ▼
                     STUDENT ANSWER
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
                MCQ            DESCRIPTIVE
                 │                   │
                 │                   ▼
                 │             AI GRADING
                 │                   │
                 └─────────┬─────────┘
                           │
                           ▼
                         SCORE
                           │
                           ▼
                  PERFORMANCE DATA
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
             ANALYTICS        AI RECOMMENDATION
                 │                   │
                 └─────────┬─────────┘
                           │
                           ▼
                     STUDY PLAN
                           │
                           ▼
                       IMPROVEMENT
🛠️ Tech Stack
Frontend
Technology	Purpose
⚛️ React 19	UI Framework
⚡ Vite	Development & Build
📘 TypeScript	Type Safety
🎨 Tailwind CSS v4	Styling
🎬 Framer Motion	Animations
🔄 Redux Toolkit	Global State
⚡ React Query	Server State
🧭 React Router DOM	Routing
📝 React Hook Form	Form Management
✅ Zod	Validation
📊 Recharts	Analytics
🔌 Socket.IO Client	Real-Time Communication
🤖 TensorFlow.js	Browser AI
🧠 MediaPipe	Computer Vision
📷 React Webcam	Camera Integration
📄 html2pdf.js	PDF Generation
✍️ TipTap	Rich Text Editing
Backend
Technology	Purpose
🟢 Node.js 20+	Runtime
🚀 Express.js	API Framework
📘 TypeScript	Type Safety
🍃 MongoDB	Database
🧩 Mongoose	ODM
⚡ Redis	Caching
📦 BullMQ	Background Jobs
🔌 Socket.IO	Real-Time Communication
🤖 Google Generative AI	AI Integration
🔑 JWT	Authentication
🛡️ Passport.js	Authentication Middleware
🔐 bcryptjs	Password Hashing
🪖 Helmet	HTTP Security
✅ Zod	Request Validation
📚 Swagger/OpenAPI	API Documentation
📂 Project Structure
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

Create a .env file:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

REDIS_URL=your_redis_url

Start the backend:

npm run dev
```

*When successful, you will see `Server is running in development mode on port 5000` in the terminal.*
*The interactive API documentation is available at `http://localhost:5000/api-docs`*

### 2. Start the Frontend Application

Open a **new, separate terminal window**, ensure you are in the root directory (`AdaptiveAi`), and run:

```bash
npm install

Start the frontend:

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
