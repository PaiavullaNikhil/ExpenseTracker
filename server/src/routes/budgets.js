import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { listBudgets, upsertBudget, budgetProgress } from '../controllers/budgetsController.js';

const router = Router();

router.use(authRequired);

router.get('/', listBudgets);

router.post('/', upsertBudget);

router.get('/progress/:month', budgetProgress);

export default router;


