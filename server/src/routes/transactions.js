import { Router } from 'express';
import { listTransactions, createTransaction, updateTransaction, deleteTransaction } from '../controllers/transactionsController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);

router.get('/', listTransactions);

router.post('/', createTransaction);

router.put('/:id', updateTransaction);

router.delete('/:id', deleteTransaction);

export default router;


