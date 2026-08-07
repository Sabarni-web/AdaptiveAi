import express from 'express';
import { logFaceViolation, getSessionLogs, getStudentLogs } from '../controllers/proctoring.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';

const router = express.Router();

// Allow students to log their own violations during the exam
router.post('/face-log', authMiddleware, logFaceViolation);

// Allow teachers and admins to view logs
router.get('/session/:examId', authMiddleware, rbac(['teacher', 'admin']), getSessionLogs);
router.get('/student/:userId', authMiddleware, rbac(['teacher', 'admin']), getStudentLogs);

export default router;
