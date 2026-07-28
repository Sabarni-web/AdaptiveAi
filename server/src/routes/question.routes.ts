import { Router } from 'express';
import { questionController } from '../controllers/questionController';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', rbac(['teacher', 'admin']), questionController.createQuestion);
router.get('/', rbac(['teacher', 'admin']), questionController.getQuestions);
router.get('/:id', questionController.getQuestion);
router.put('/:id', rbac(['teacher', 'admin']), questionController.updateQuestion);
router.delete('/:id', rbac(['teacher', 'admin']), questionController.deleteQuestion);

export default router;
