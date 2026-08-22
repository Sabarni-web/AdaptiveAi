import { Router } from 'express';
import { 
  logMultiplePersonViolation, 
  getViolationsForExam, 
  getIntegrityScore, 
  logHeadDirectionViolation, 
  getHeadDirectionViolations,
  logExamViolation,
  getExamViolations
} from '../controllers/proctoring.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/multiple-person', logMultiplePersonViolation);
router.get('/integrity/:examId', getIntegrityScore);
router.get('/multiple-person/:examId', restrictTo('admin', 'teacher'), getViolationsForExam);

// Head Direction Routes
router.post('/head-direction', logHeadDirectionViolation);
router.get('/head-direction/:examId', restrictTo('admin', 'teacher'), getHeadDirectionViolations);

// Unified Exam Violation Routes
router.post('/violations', logExamViolation);
router.get('/violations/:examSessionId', restrictTo('admin', 'teacher'), getExamViolations);

export default router;
