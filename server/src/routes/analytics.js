import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = Router();

router.use(authRequired);

router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const start7 = new Date(now);
    start7.setDate(start7.getDate() - 6);

    const last7 = await Transaction.aggregate([
      { $match: { userId, date: { $gte: start7 } } },
      {
        $group: {
          _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const byCategory = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    const totalsAgg = await Transaction.aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
    const totals = Object.fromEntries(totalsAgg.map((t) => [t._id, t.total]));

    res.json({ last7, byCategory, totals: { income: totals.income || 0, expense: totals.expense || 0, balance: (totals.income || 0) - (totals.expense || 0) } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute analytics' });
  }
});

export default router;


