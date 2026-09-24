import { Router } from 'express';
import { analyzeDiagnostic, getDiagnostics } from '../controllers/diagnosticController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/analyze', analyzeDiagnostic);
router.get('/', getDiagnostics);

export default router;
