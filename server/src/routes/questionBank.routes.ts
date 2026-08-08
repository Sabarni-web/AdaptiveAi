import { Router } from 'express';
import { questionBankController } from '../controllers/questionBankController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/domains', questionBankController.getDomains);
router.get('/subjects', questionBankController.getSubjects);
router.get('/count', questionBankController.getQuestionCount);

export default router;
