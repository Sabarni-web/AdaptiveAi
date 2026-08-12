import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validator.middleware';
import { updateSettingsSchema } from '../validators/settings.validator';

const router = Router();

// All settings routes require authentication
router.use(authMiddleware);

router.get('/', getSettings);
router.patch('/', validateBody(updateSettingsSchema), updateSettings);

export default router;
