import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

export async function getAnalytics(req, res) {
  try {
    const userId = req.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    const { start: startStr, end: endStr } = req.query;
    const startFilter = startStr ? new Date(startStr) : null;
    const endFilter = endStr ? new Date(endStr) : null;
    const start7 = new Date(now);
    start7.setDate(start7.getDate() - 6);

    const last7Match = { userId: userObjectId };
    if (startFilter) {
      last7Match.date = { ...(last7Match.date || {}), $gte: startFilter };
    } else {
      last7Match.date = { ...(last7Match.date || {}), $gte: start7 };
    }
    if (endFilter) {
      last7Match.date = { ...(last7Match.date || {}), $lt: endFilter };
    }

    const last7 = await Transaction.aggregate([
      { $match: last7Match },
      {
        $group: {
          _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const byCategoryMatch = { userId: userObjectId, type: 'expense' };
    if (startFilter) byCategoryMatch.date = { ...(byCategoryMatch.date || {}), $gte: startFilter };
    if (endFilter) byCategoryMatch.date = { ...(byCategoryMatch.date || {}), $lt: endFilter };

    const byCategory = await Transaction.aggregate([
      { $match: byCategoryMatch },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    const boundaryStart = startFilter ? new Date(startFilter.getFullYear(), startFilter.getMonth(), 1) : new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const boundaryEnd = endFilter ? new Date(endFilter) : now;
    const monthEndExclusive = new Date(boundaryEnd.getFullYear(), boundaryEnd.getMonth() + 1, 1);
    const monthlyAgg = await Transaction.aggregate([
      { $match: { userId: userObjectId, date: { $gte: boundaryStart, $lt: monthEndExclusive } } },
      {
        $group: {
          _id: { m: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.m': 1 } },
    ]);
    const monthlyMap = {};
    monthlyAgg.forEach((r) => {
      const m = r._id.m;
      if (!monthlyMap[m]) monthlyMap[m] = { month: m, income: 0, expense: 0 };
      monthlyMap[m][r._id.type] = r.total;
    });
    const monthlyTrend = Object.values(monthlyMap).sort((a,b)=>a.month.localeCompare(b.month)).map((x)=>({ ...x, savings: (x.income||0)-(x.expense||0) }));

    const totalsMatch = { userId: userObjectId };
    if (startFilter) totalsMatch.date = { ...(totalsMatch.date || {}), $gte: startFilter };
    if (endFilter) totalsMatch.date = { ...(totalsMatch.date || {}), $lt: endFilter };
    const totalsAgg = await Transaction.aggregate([
      { $match: totalsMatch },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
    const totals = Object.fromEntries(totalsAgg.map((t) => [t._id, t.total]));

    res.json({ last7, byCategory, monthlyTrend, totals: { income: totals.income || 0, expense: totals.expense || 0, balance: (totals.income || 0) - (totals.expense || 0) } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute analytics' });
  }
}


