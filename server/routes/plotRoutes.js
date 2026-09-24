import { Router } from 'express';
import { getPlots, createPlot, deletePlot } from '../controllers/plotController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getPlots);
router.post('/', createPlot);
router.delete('/:id', deletePlot);

export default router;
