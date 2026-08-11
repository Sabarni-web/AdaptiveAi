import { Router } from 'express';
import { examController } from '../controllers/examController';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';
import { rateLimiter } from '../middleware/rateLimiter.middleware';
import { validateBody } from '../middleware/validator.middleware';
import { startExamSchema, answerSchema } from '../validators/exam.validator';

const router = Router();

router.use(authMiddleware);
router.use(rbac(['student']));

router.get('/search', examController.searchExams);
router.get('/details/:examId', examController.getExamDetails);
router.post('/start', validateBody(startExamSchema), examController.startExam);
router.get('/:sessionId/next-question', examController.getNextQuestion);
router.post('/:sessionId/answer', rateLimiter('exam'), validateBody(answerSchema), examController.submitAnswer);
router.post('/:sessionId/submit', examController.submitExam);
router.get('/:sessionId/status', examController.getStatus);
router.get('/:sessionId/result', examController.getResult);
router.get('/history', examController.getHistory);

export default router;
