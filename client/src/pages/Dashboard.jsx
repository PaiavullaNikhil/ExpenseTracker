import { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [last7, setLast7] = useState([]);
  const [byCategory, setByCategory] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/analytics');
      setSummary(data.totals);
      // Flatten last7 to per-day net
      const map = {};
      data.last7.forEach((r) => {
        const day = r._id.d;
        if (!map[day]) map[day] = { day, income: 0, expense: 0 };
        map[day][r._id.type] = r.total;
      });
      setLast7(Object.values(map));
      setByCategory(data.byCategory.map((x) => ({ name: x._id, value: x.total })));
    })();
  }, []);

  const COLORS = ['#60a5fa', '#f472b6', '#facc15', '#34d399', '#f87171', '#a78bfa'];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70">Income</div>
          <div className="text-2xl font-bold">₹{summary.income}</div>
        </div>
        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70">Expense</div>
          <div className="text-2xl font-bold">₹{summary.expense}</div>
        </div>
        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70">Balance</div>
          <div className="text-2xl font-bold">₹{summary.balance}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="text-sm opacity-70 mb-2">Last 7 days</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day"/>
                <YAxis/>
                <Tooltip/>
                <Area type="monotone" dataKey="expense" stroke="#f87171" fillOpacity={0.2} fill="#f87171" />
                <Area type="monotone" dataKey="income" stroke="#34d399" fillOpacity={0.2} fill="#34d399" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="text-sm opacity-70 mb-2">By Category</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={90}>
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


