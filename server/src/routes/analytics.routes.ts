import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/predict', rbac(['student', 'teacher', 'admin']), analyticsController.predictPerformance);
router.post('/recommend', rbac(['student']), analyticsController.recommendStudy);

export default router;
