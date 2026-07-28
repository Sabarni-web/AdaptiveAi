import { Router } from 'express';
import { teacherController } from '../controllers/teacherController';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware);
router.use(rbac(['teacher', 'admin']));

router.get('/exam-configs', teacherController.getExamConfigs);
router.post('/exam-configs', teacherController.createExamConfig);
router.get('/grading/pending', teacherController.getPendingGrading);
router.put('/grading/:answerId/override', teacherController.overrideGrade);

export default router;
