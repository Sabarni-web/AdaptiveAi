import express from 'express';
import { getTodayPlan, startTask, completeTask } from '../controllers/studyPlan.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.get('/today', getTodayPlan);
router.post('/:planId/tasks/:taskId/start', startTask);
router.post('/:planId/tasks/:taskId/complete', completeTask);

export default router;
