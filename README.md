<h1 align="center">
  <br>
  🧠 AdaptiveAI
  <br>
</h1>

<h4 align="center">An intelligent, microservice-driven examination platform powered by AI.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue.svg" alt="React 19">
  <img src="https://img.shields.io/badge/Node.js-20+-green.svg" alt="Node.js 20+">
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg" alt="MongoDB">
  <img src="https://img.shields.io/badge/AI-Gemini-orange.svg" alt="AI Gemini">
  <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Status Active">
</p>

---

## 🌟 Introduction

**AdaptiveAI** is a next-generation examination platform designed to provide a tailored assessment experience. By leveraging artificial intelligence, it offers adaptive testing that adjusts to a student's ability, AI-powered grading for descriptive answers, automated proctoring, and comprehensive analytics.

## ✨ Key Features

- **🎯 Adaptive Testing Engine**: Dynamically selects questions based on the test-taker's estimated ability (Item Response Theory).
- **🤖 AI-Powered Grading**: Uses LLMs (Google Generative AI) to evaluate descriptive answers against custom rubrics.
- **👁️ Automated Proctoring**: Integrates TensorFlow & MediaPipe (`coco-ssd`, `face_mesh`) for real-time monitoring and anomaly detection during exams.
- **📊 Advanced Analytics**: Generates actionable insights and study recommendations for students.
- **📜 Automated Certificates**: Generates verifiable certificates with QR codes for successful exam completions.
- **⚡ Real-Time Updates**: Utilizes Socket.IO for live grading updates and examination telemetry.
- **🔐 Secure & Scalable**: Features robust JWT authentication, RBAC, Rate Limiting, and BullMQ for background job processing.

## 🚀 Tech Stack

### Frontend (Client)
- **Core**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **State & Data**: Redux Toolkit, React Query
- **Forms**: React Hook Form, Zod
- **AI/Proctoring**: TensorFlow.js, MediaPipe, React Webcam
- **Utilities**: Socket.IO Client, html2pdf.js, Recharts, TipTap

### Backend (API Gateway)
- **Core**: Node.js 20+, Express.js, TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Caching & Queues**: Redis, BullMQ
- **AI Integration**: Google Generative AI SDK
- **Real-Time**: Socket.IO
- **Security**: Passport.js, JWT, Helmet, Rate Limiter Flexible, bcryptjs
- **Documentation**: Swagger / OpenAPI 3.0

## 📂 Project Structure

AdaptiveAI is built as a monorepo containing both the frontend and backend.

```text
AdaptiveAi/
├── client/               # Frontend React Application
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Tutor, Settings, etc.)
│   │   ├── pages/        # Main route pages
│   │   ├── services/     # API integration (e.g., certificateService)
│   │   └── store/        # Redux state management
│   └── package.json      # Client dependencies
├── server/               # Backend API Gateway
│   ├── src/
│   │   ├── config/       # Environment, Database, Swagger configs
│   │   ├── controllers/  # Route handlers
│   │   ├── events/       # Socket.IO event listeners
│   │   ├── jobs/         # BullMQ workers (Grading, Emails)
│   │   ├── models/       # Mongoose Schemas
│   │   ├── routes/       # Express route definitions
│   │   └── services/     # Business logic & AI integrations
│   └── package.json      # Server dependencies
└── package.json          # Root workspace configuration
```

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB (Running locally on default port `27017` or via connection string in `.env`)
- Redis (Optional for local dev, mocked in-memory if not present)

### 1. Start the Backend Server

The backend requires its own `.env` file configured with your MongoDB URI, JWT Secret, and Gemini API keys.

```bash
cd server
npm install
npm run dev
```

*The API will be available at `http://localhost:5000`*
*Interactive API documentation: `http://localhost:5000/api-docs`*

### 2. Start the Frontend Application

Open a new terminal in the root directory:

```bash
cd client
npm install
npm run dev
```

*Alternatively, run `npm run dev` from the root directory to start both client and server concurrently.*

*The frontend application will be accessible at `http://localhost:5173`*

## 🧠 Architecture Overview

AdaptiveAI employs a robust API Gateway pattern using Node.js/Express. 

1. **Authentication & Authorization**: Secure routes using JWT and Role-Based Access Control.
2. **AI Offloading**: Heavy AI computations and grading tasks are offloaded to **BullMQ** workers to keep the main event loop non-blocking.
3. **Real-time Communication**: **Socket.IO** is used extensively to push grading statuses and proctoring alerts back to the client.
4. **AI Microservices**: Integrates with LLMs to power the Adaptive Engine (question selection), NLP Engine (grading), and Analytics Engine (recommendations).

---
<p align="center">Made with ❤️ for modern education.</p>
