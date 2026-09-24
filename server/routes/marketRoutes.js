import { Router } from 'express';
import { getMarketPrices } from '../controllers/marketController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/prices', getMarketPrices);

export default router;
