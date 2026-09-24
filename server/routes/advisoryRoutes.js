import { Router } from 'express';
import { generateAdvisory, getAdvisories } from '../controllers/advisoryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/generate', generateAdvisory);
router.get('/', getAdvisories);

export default router;
