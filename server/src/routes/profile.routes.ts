import express from 'express';
import { getIntelligenceProfile, updateProfile } from '../controllers/profileController';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/me/intelligence-profile', getIntelligenceProfile);
router.put('/me/profile', updateProfile);

export default router;
