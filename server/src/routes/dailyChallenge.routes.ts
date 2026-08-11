import { Router } from 'express';
import {
  getTodayChallenge,
  startChallenge,
  submitChallenge,
  getStats,
  getHistory
} from '../controllers/dailyChallenge.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All daily challenge routes require authentication
router.use(authMiddleware as any);

router.get('/today', getTodayChallenge);
router.post('/start', startChallenge);
router.post('/:id/submit', submitChallenge);
router.get('/stats', getStats);
router.get('/history', getHistory);

export default router;
