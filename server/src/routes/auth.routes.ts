import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimiter } from '../middleware/rateLimiter.middleware';
import { validateBody } from '../middleware/validator.middleware';
import { registerSchema, loginSchema, refreshSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', rateLimiter('auth'), validateBody(registerSchema), authController.register);
router.post('/login', rateLimiter('auth'), validateBody(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authMiddleware, authController.logout);

export default router;
