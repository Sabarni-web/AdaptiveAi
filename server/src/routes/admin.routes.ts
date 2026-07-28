import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware);
router.use(rbac(['admin', 'super_admin']));

router.get('/users', adminController.getUsers);
router.get('/system-health', adminController.getSystemHealth);

export default router;
