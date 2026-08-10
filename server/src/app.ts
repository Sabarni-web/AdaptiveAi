import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './utils/logger';
import { rateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import authRoutes from './routes/auth.routes';
import examRoutes from './routes/exam.routes';
import questionRoutes from './routes/question.routes';
import notificationRoutes from './routes/notification.routes';
import resultRoutes from './routes/result.routes';
import analyticsRoutes from './routes/analytics.routes';
import teacherRoutes from './routes/teacher.routes';
import adminRoutes from './routes/admin.routes';
import certificateRoutes from './routes/certificate.routes';
import profileRoutes from './routes/profile.routes';
import questionBankRoutes from './routes/questionBank.routes';
import proctoringRoutes from './routes/proctoring.routes';
import tutorRoutes from './routes/tutor.routes';
import { setupSwagger } from './config/swagger';

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*', // Allow all origins for development (or specify 'http://localhost:5173')
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(rateLimiter('general'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup Swagger API docs
setupSwagger(app);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/results', resultRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/teacher', teacherRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/users', profileRoutes);
app.use('/api/v1/question-bank', questionBankRoutes);
app.use('/api/v1/proctoring', proctoringRoutes);
app.use('/api/v1/tutor', tutorRoutes);
app.use(errorHandler);

export default app;
