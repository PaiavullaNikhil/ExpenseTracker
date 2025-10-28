import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);

router.get('/', async (req, res) => {
  try {
    const { start, end, category, type, q, page = 1, limit = 20 } = req.query;
    const where = { userId: req.userId };
    if (start || end) where.date = {};
    if (start) where.date.$gte = new Date(start);
    if (end) where.date.$lte = new Date(end);
    if (category) where.category = category;
    if (type) where.type = type;
    if (q) where.title = { $regex: q, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Transaction.find(where).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(where),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.userId };
    const created = await Transaction.create(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add transaction' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update transaction' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete transaction' });
  }
});

export default router;


