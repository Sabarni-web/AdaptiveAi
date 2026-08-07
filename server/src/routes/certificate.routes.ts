import { Router } from 'express';
import { 
  generateCertificate, 
  getMyCertificates, 
  getCertificateById, 
  verifyCertificate, 
  downloadCertificate, 
  getAdminCertificates, 
  deleteCertificate 
} from '../controllers/certificate.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/verify/:certificateId', verifyCertificate);
router.get('/download/:certificateId', downloadCertificate);

// Protected routes
router.use(authMiddleware);

// Student routes
router.post('/generate', generateCertificate);
router.get('/my-certificates', getMyCertificates);
router.get('/:id', getCertificateById);

// Admin routes
router.get('/admin/all', rbac(['admin']), getAdminCertificates);
router.delete('/:id', rbac(['admin']), deleteCertificate);

export default router;
