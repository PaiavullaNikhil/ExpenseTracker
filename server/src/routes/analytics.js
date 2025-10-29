import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = Router();

router.use(authRequired);

router.get('/', getAnalytics);

export default router;


