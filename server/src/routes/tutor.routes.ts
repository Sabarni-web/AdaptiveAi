import { Router } from 'express';
import { tutorController } from '../controllers/tutorController';
import { protect } from '../middleware/auth.middleware';
import { rateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.use(protect);
// Limit to 20 requests per minute for the AI tutor to prevent spam/API exhaustion
router.post('/ask', rateLimiter('general'), tutorController.askDoubt);

export default router;
