import { Router } from 'express';
import { 
  getSettings, 
  updateSettings, 
  changePassword, 
  getSecurityOverview, 
  logoutAllSessions, 
  exportLearningData, 
  exportExamHistory, 
  deleteAccount 
} from '../controllers/settingsController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validator.middleware';
import { updateSettingsSchema } from '../validators/settings.validator';

const router = Router();

// All settings routes require authentication
router.use(authMiddleware);

router.get('/', getSettings);
router.patch('/', validateBody(updateSettingsSchema), updateSettings);

// Security & Privacy routes
router.post('/change-password', changePassword);
router.get('/security-overview', getSecurityOverview);
router.post('/logout-all', logoutAllSessions);
router.get('/export-learning-data', exportLearningData);
router.get('/export-exam-history', exportExamHistory);
router.delete('/delete-account', deleteAccount);

export default router;

