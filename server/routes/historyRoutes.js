import { Router } from 'express';
import { getAllHistory } from '../controllers/historyController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/all', getAllHistory);

export default router;
