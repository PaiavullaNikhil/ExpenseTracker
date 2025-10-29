import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import api from '../services/api';

export default function Analytics() {
  const [data, setData] = useState({ last7: [], byCategory: [], monthlyTrend: [], totals: { income: 0, expense: 0, balance: 0 } });
  const [period, setPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30*24*60*60*1000).toISOString().slice(0,10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0,10));

  useEffect(() => {
    (async () => {
      try {
        const endExclusive = new Date(new Date(endDate).getTime() + 24*60*60*1000).toISOString();
        const { data: res } = await api.get('/analytics', { params: { start: new Date(startDate).toISOString(), end: endExclusive } });
        setData(res || { last7: [], byCategory: [], monthlyTrend: [], totals: { income: 0, expense: 0, balance: 0 } });
      } catch (err) {
        console.error('Failed to load analytics', err);
      }
    })();
  }, [startDate, endDate]);

  const pieData = useMemo(() => data.byCategory.map(x => ({ name: x._id, value: x.total })), [data]);
  const COLORS = ['#fb923c', '#ef4444', '#06b6d4', '#a78bfa', '#22c55e', '#60a5fa'];
  const topCategory = pieData.sort((a,b)=>b.value-a.value)[0]?.name;
  const avgDaily = Math.round((data.totals.expense || 0) / 30);
  const totalTx = data.last7.length;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input type="date" className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 w-full md:w-auto" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
          <span className="self-center opacity-70">to</span>
          <input type="date" className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 w-full md:w-auto" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button onClick={() => setPeriod('weekly')} className={`px-3 py-2 rounded border ${period==='weekly'?'bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black':'border-zinc-300 dark:border-white/10'}`}>Weekly</button>
          <button onClick={() => setPeriod('monthly')} className={`px-3 py-2 rounded border ${period==='monthly'?'bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black':'border-zinc-300 dark:border-white/10'}`}>Monthly</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70">Most Spent Category</div>
          <div className="text-2xl font-bold">{topCategory || 'N/A'} {topCategory === 'Food' && '🍕'}</div>
        </div>
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70">Average Daily Spend</div>
          <div className="text-2xl font-bold">₹{avgDaily}</div>
        </div>
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70">Total Transactions</div>
          <div className="text-2xl font-bold">{totalTx}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-sm opacity-70 mb-2">Expense by Category</div>
          <div className="h-64">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                    {pieData.map((_,i)=> (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-sm opacity-70">No data</div>
            )}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-sm opacity-70 mb-2">Monthly Savings Trend</div>
          <div className="h-64 overflow-x-auto md:overflow-x-visible">
            {data.monthlyTrend.length ? (
              <div className="min-w-[600px] md:min-w-0 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthlyTrend}>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="savings" stroke="#60a5fa" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-full grid place-items-center text-sm opacity-70">No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <div className="text-sm opacity-70 mb-2">Income vs Expense Comparison</div>
        <div className="h-64 overflow-x-auto md:overflow-x-visible">
          {data.monthlyTrend.length ? (
            <div className="min-w-[700px] md:min-w-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrend}>
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  <Tooltip/>
                  <Bar dataKey="income" fill="#22d3ee" radius={[6,6,0,0]} />
                  <Bar dataKey="expense" fill="#6366F1" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full grid place-items-center text-sm opacity-70">No data</div>
          )}
        </div>
      </div>

      {/* Insights & Download */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Insights</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Your spending dropped 8% this month. Great job!</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📊</span>
            <span>You spent most on weekends.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Top category: {topCategory || 'N/A'}</span>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black font-semibold" onClick={() => alert('Export coming soon')}>Download Report (CSV/PDF)</button>
      </div>
    </div>
  );
}


