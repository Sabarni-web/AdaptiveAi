import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware);
router.use(rbac(['admin', 'super_admin']));

router.get('/users', adminController.getUsers);
router.get('/system-health', adminController.getSystemHealth);
router.post('/generate-questions', adminController.generateQuestions);
router.get('/questions', adminController.getQuestions);
router.delete('/questions/:id', adminController.deleteQuestion);
router.put('/questions/:id/translations', adminController.updateQuestionTranslations);

export default router;
