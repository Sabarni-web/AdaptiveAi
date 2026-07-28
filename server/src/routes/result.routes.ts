import { Router } from 'express';
import { resultController } from '../controllers/resultController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', resultController.getStudentResults);
router.get('/:id', resultController.getResultById);

export default router;
