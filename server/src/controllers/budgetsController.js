import mongoose from 'mongoose';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

export async function listBudgets(req, res) {
  try {
    const items = await Budget.find({ userId: req.userId }).sort({ month: -1, category: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
}

export async function upsertBudget(req, res) {
  try {
    const payload = { ...req.body, userId: req.userId };
    const created = await Budget.findOneAndUpdate(
      { userId: payload.userId, month: payload.month, category: payload.category },
      payload,
      { new: true, upsert: true }
    );
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: 'Failed to save budget' });
  }
}

export async function budgetProgress(req, res) {
  try {
    const { month } = req.params;
    const start = new Date(month + '-01T00:00:00.000Z');
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const budgets = await Budget.find({ userId: req.userId, month });
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    const spends = await Transaction.aggregate([
      { $match: { userId: userObjectId, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const map = Object.fromEntries(spends.map((s) => [s._id, s.total]));
    const result = budgets.map((b) => ({
      category: b.category,
      limit: b.limit,
      spent: map[b.category] || 0,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute progress' });
  }
}


