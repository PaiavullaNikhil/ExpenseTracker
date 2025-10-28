import { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function Budget() {
  const [items, setItems] = useState([]);
  const [progress, setProgress] = useState([]);
  const [form, setForm] = useState({ month: new Date().toISOString().slice(0,7), category: '', limit: '' });
  const [totalMonthlyLimit, setTotalMonthlyLimit] = useState('');
  const [hasMonthly, setHasMonthly] = useState(false);
  const currentMonth = new Date().toISOString().slice(0,7);

  async function load() {
    try {
      const { data } = await api.get('/budget');
      setItems(data || []);
      const monthly = (data || []).find(b => b.category === 'Monthly' && b.month === currentMonth);
      if (monthly) {
        setHasMonthly(true);
        setTotalMonthlyLimit(String(monthly.limit || ''));
      } else {
        setHasMonthly(false);
      }
      const { data: progData } = await api.get(`/budget/progress/${currentMonth}`);
      setProgress(progData || []);
    } catch (err) {
      console.error('Failed to load budget data', err);
    }
  }

  async function saveBudget(e) {
    e.preventDefault();
    if (!form.category || !form.limit) return alert('Fill all fields');
    await api.post('/budget', { ...form, limit: Number(form.limit) });
    setForm({ ...form, category: '', limit: '' });
    load();
  }

  async function saveMonthlyBudget(e) {
    e.preventDefault();
    if (!totalMonthlyLimit) return alert('Enter monthly limit');
    await api.post('/budget', { month: currentMonth, category: 'Monthly', limit: Number(totalMonthlyLimit) });
    load();
  }

  async function resetBudget() {
    if (!confirm('Reset all budgets?')) return;
    // Would implement reset endpoint
    alert('Reset coming soon');
  }

  useEffect(() => { load(); }, []);

  const pieData = progress.filter(p => p.category !== 'Monthly').map(p => ({ name: p.category, value: p.spent }));
  const barChartData = progress.filter(p => p.category !== 'Monthly');
  const COLORS = ['#fb923c', '#ef4444', '#06b6d4', '#a78bfa', '#22c55e', '#60a5fa'];
  
  // Calculate remaining budget
  const monthlyLimit = hasMonthly ? Number(totalMonthlyLimit) : 0;
  const currentCategoryBudgets = items.filter(i => i.category !== 'Monthly' && i.month === currentMonth).reduce((sum, i) => sum + (i.limit || 0), 0);
  const remainingBudget = monthlyLimit - currentCategoryBudgets;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Monthly Budget Form */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Set Monthly Budget</h3>
        <form onSubmit={saveMonthlyBudget} className="flex gap-2">
          <input type="number" className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 flex-1" placeholder="Total monthly limit (₹)" value={totalMonthlyLimit} onChange={(e)=>setTotalMonthlyLimit(e.target.value)} />
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black">{hasMonthly ? 'Update' : 'Save'}</button>
        </form>
        <div className="text-xs opacity-70 mt-2">Current month: {currentMonth} {hasMonthly && `(set to ₹${totalMonthlyLimit})`}</div>
      </div>

      {/* Category Budget Form */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Set Category Budget</h3>
          {hasMonthly && (
            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              Remaining Budget: ₹{remainingBudget}
            </div>
          )}
        </div>
        <form onSubmit={saveBudget} className="grid grid-cols-5 gap-2">
          <input type="month" className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" value={form.month} onChange={(e)=>setForm({...form,month:e.target.value})} />
          <select className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white dark:border-white/10" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} required>
            <option value="" className="dark:bg-zinc-900 dark:text-white">Category</option>
            <option value="Food" className="dark:bg-zinc-900 dark:text-white">Food</option>
            <option value="Travel" className="dark:bg-zinc-900 dark:text-white">Travel</option>
            <option value="Shopping" className="dark:bg-zinc-900 dark:text-white">Shopping</option>
            <option value="Bills" className="dark:bg-zinc-900 dark:text-white">Bills</option>
            <option value="Rent" className="dark:bg-zinc-900 dark:text-white">Rent</option>
            <option value="Other" className="dark:bg-zinc-900 dark:text-white">Other</option>
          </select>
          <input type="number" max={remainingBudget} className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" placeholder={`Limit (₹) - Max: ₹${remainingBudget}`} value={form.limit} onChange={(e)=>setForm({...form,limit:e.target.value})} required />
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black">Save</button>
          <button type="button" className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/10" onClick={resetBudget}>Reset</button>
        </form>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-sm opacity-70 mb-2">Spending by category</div>
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
              <div className="h-full grid place-items-center text-sm opacity-70">No budget data</div>
            )}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-sm opacity-70 mb-2">Category comparison</div>
          <div className="h-64 overflow-x-auto">
            {progress.length ? (
            <ResponsiveContainer width={600} height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="category"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="spent" fill="#6366F1" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-sm opacity-70">No budget data</div>
            )}
          </div>
        </div>
      </div>

      {/* Category Budget Table */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Category Budget Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Limit</th>
                <th className="py-2 px-3">Spent</th>
                <th className="py-2 px-3">Remaining</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {progress.filter(p => p.category !== 'Monthly').map((p, i) => {
                const rem = p.limit - p.spent;
                const pct = (p.spent / p.limit) * 100;
                const status = pct >= 90 ? 'Critical' : pct >= 70 ? 'Warning' : 'OK';
                return (
                  <tr key={i} className="border-t border-zinc-100 dark:border-white/10">
                    <td className="py-2 px-3 font-medium">{p.category}</td>
                    <td className="py-2 px-3">₹{p.limit}</td>
                    <td className="py-2 px-3">₹{p.spent}</td>
                    <td className="py-2 px-3">₹{rem}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        status === 'Critical' ? 'bg-red-500' :
                        status === 'Warning' ? 'bg-orange-500' : 'bg-green-500'
                      }`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
              {progress.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center opacity-70">No budgets set yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Spending Progress</h3>
        <div className="space-y-3">
          {progress.filter(p => p.category !== 'Monthly').map((p, i) => {
            const pct = Math.min((p.spent / p.limit) * 100, 100);
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{p.category}</span>
                  <span className="text-xs opacity-70">{p.spent} / {p.limit} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-200 dark:bg-white/10">
                  <div className={`h-full rounded-full transition-all ${
                    pct >= 90 ? 'bg-red-500' :
                    pct >= 70 ? 'bg-orange-500' : 'bg-green-500'
                  }`} style={{width: `${Math.min(pct, 100)}%`}} />
                </div>
                {pct >= 70 && (
                  <div className="text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    <span className="text-orange-600 dark:text-orange-400">You're nearing your {p.category} budget limit!</span>
                  </div>
                )}
              </div>
            );
          })}
          {progress.length === 0 && (
            <div className="text-sm opacity-70 text-center py-4">Set budgets to see progress</div>
          )}
        </div>
      </div>
    </div>
  );
}


