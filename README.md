🌟 Overview

**AdaptiveAI** is an intelligent, microservice-driven examination platform designed to transform traditional online examinations into a personalized and data-driven learning experience.

Instead of giving every student the same static examination experience, AdaptiveAI uses artificial intelligence, adaptive testing, and performance analytics to understand the learner and provide a more personalized assessment journey.

The platform combines:

- 🎯 Adaptive Testing
- 🤖 AI-Powered Descriptive Grading
- 🧠 AI Doubt Solver
- 📊 Performance Analytics
- 👁️ Examination Integrity Monitoring
- 📜 Smart Certificates
- 🔥 AI Daily Challenges
- 🎯 Personalized Study Recommendations
- 📅 Today's Study Plan
- ⚡ Real-Time Examination Updates

### Our Vision

> **Don't just evaluate students. Understand how they learn.**

---

# ✨ Features

## 🎯 Adaptive Examination Engine

AdaptiveAI dynamically selects questions according to the student's performance and estimated ability.

The examination engine supports:

- Difficulty-aware question selection
- Easy → Medium → Advanced progression
- Performance-based adaptation
- Domain-based question banks
- Subject-based question selection
- MCQ questions
- SAQ / descriptive questions
- Dynamic examination sessions
- Automatic score calculation

---

## 🤖 AI-Powered Descriptive Grading

Students can submit descriptive answers and AdaptiveAI can evaluate them using AI-powered grading.

The grading system can consider:

- Answer relevance
- Concept correctness
- Keyword coverage
- Explanation quality
- Rubric-based evaluation

If the answer is incorrect, the platform can provide:

- Correct answer
- Explanation
- Feedback
- Performance insight

This transforms grading from simple marks into meaningful learning feedback.

---

# 🧠 AI Doubt Solver

AdaptiveAI includes an AI-powered study assistant accessible from the dashboard.

Students can ask subjective academic questions and receive AI-generated explanations.

Example:

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
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Tutor/
│   │   │   ├── Dashboard/
│   │   │   ├── Exam/
│   │   │   ├── Analytics/
│   │   │   └── Settings/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Exams/
│   │   │   ├── Results/
│   │   │   ├── Certificates/
│   │   │   ├── Analytics/
│   │   │   └── Settings/
│   │   │
│   │   ├── services/
│   │   │   └── certificateService/
│   │   │
│   │   └── store/
│   │       └── Redux/
│   │
│   └── package.json
│
├── server/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── events/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   │
│   └── package.json
│
├── package.json
└── README.md
⚙️ Getting Started
Prerequisites

Make sure you have:

Node.js 20+
MongoDB
Git
npm

Redis is recommended for production.

For local development, Redis can be mocked if configured by the application.

1️⃣ Clone the Repository
git clone https://github.com/YOUR_USERNAME/AdaptiveAi.git

cd AdaptiveAi
2️⃣ Setup Backend
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

Backend:

http://localhost:5000

Swagger API Documentation:

http://localhost:5000/api-docs
3️⃣ Setup Frontend

Open another terminal:

cd client

npm install

Start the frontend:

npm run dev

Frontend:

http://localhost:5173
🔑 Environment Variables

Never commit real API keys or secrets.

Example:

# Server
PORT=5000

# Database
MONGODB_URI=

# Authentication
JWT_SECRET=

# AI
GEMINI_API_KEY=

# Redis
REDIS_URL=

Add .env to .gitignore.

🗃️ Question Bank

AdaptiveAI supports domain-based CSE examination content.

Currently supported domains include:

┌───────────────────────────────┐
│ CSE Core                      │
├───────────────────────────────┤
│ CSE AI / ML                   │
├───────────────────────────────┤
│ CSE Data Science              │
├───────────────────────────────┤
│ CSE Cyber Security            │
├───────────────────────────────┤
│ CSE Software Engineering      │
└───────────────────────────────┘

Each domain can contain multiple subjects and question banks.

Questions can support:

MCQ
SAQ
Difficulty levels
Topics
Correct answers
Explanations
Subject mapping
Domain mapping

This allows the examination engine to fetch questions based on:

Domain → Subject → Difficulty → Examination

📊 Learning Intelligence

AdaptiveAI doesn't stop at calculating marks.

The platform transforms examination data into learning intelligence.

                    EXAM DATA
                        │
                        ▼
                PERFORMANCE ANALYSIS
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       Strength       Weakness     Difficulty
       Detection      Detection     Analysis
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
                AI RECOMMENDATION
                        │
                        ▼
                   STUDY PLAN
                        │
                        ▼
                    PRACTICE
                        │
                        ▼
                   IMPROVEMENT
The Learning Loop

Attempt → Analyze → Recommend → Practice → Improve

📜 Smart Certificate Workflow
Complete Exam
      │
      ▼
Calculate Score
      │
      ▼
Check Eligibility
      │
      ▼
Generate Certificate
      │
      ▼
Generate QR Code
      │
      ▼
Download / Share
      │
      ▼
Verify Certificate
🔄 Adaptive Testing Workflow
START EXAM
    │
    ▼
Initial Question
    │
    ▼
Student Answer
    │
    ▼
Evaluate Response
    │
    ▼
Estimate Ability
    │
    ▼
Select Next Question
    │
    ├──── Weak Performance ────► Easier Question
    │
    ├──── Normal Performance ──► Similar Difficulty
    │
    └──── Strong Performance ──► Harder Question
    │
    ▼
Continue Examination
    │
    ▼
Final Score
📱 Platform Modules

AdaptiveAI is organized into multiple interconnected modules:

🏠 Dashboard
│
├── 🎯 Exams
│
├── 📊 Results
│
├── 📈 Analytics
│
├── 🧠 AI Doubt Solver
│
├── 🔥 Daily Challenge
│
├── 🎯 AI Recommendations
│
├── 📅 Study Plan
│
├── 📜 Certificates
│
└── ⚙️ Settings
🚀 Why AdaptiveAI?

Traditional examination platforms usually answer:

"What score did the student get?"

AdaptiveAI aims to answer much more:

What does the student know?
        ↓
Where is the student struggling?
        ↓
What difficulty level suits the student?
        ↓
What should the student study next?
        ↓
How can the student improve?

This transforms an examination platform into an AI-powered learning ecosystem.

🔮 Roadmap
 Advanced IRT-based adaptive testing
 Larger AI-powered question banks
 Personalized learning paths
 AI-generated study notes
 AI-generated revision plans
 Voice-based AI Tutor
 Advanced student analytics
 Teacher dashboard
 Institution dashboard
 Institution-level analytics
 Multi-language examinations
 Advanced certificate verification
 Cloud deployment
 Mobile application
 Advanced AI learning personalization
🛡️ Responsible AI

AdaptiveAI is designed as an educational assistance and assessment platform.

AI-generated grading, recommendations, monitoring signals, and other AI outputs should be treated as assistive systems, particularly for high-stakes academic decisions.

Human oversight should be maintained where required.
