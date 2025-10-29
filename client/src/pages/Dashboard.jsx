import { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, LineChart, Line } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth?.() || { user: null };
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [last7, setLast7] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState({ limit: 0, spent: 0 });
  const [currentMonthStats, setCurrentMonthStats] = useState({ income: 0, expense: 0 });
  const [categoryBudgets, setCategoryBudgets] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/analytics');
        setSummary(data.totals);
        // Flatten last7 to per-day net
        const map = {};
        (data.last7 || []).forEach((r) => {
          const day = r._id.d;
          if (!map[day]) map[day] = { day, income: 0, expense: 0 };
          map[day][r._id.type] = r.total;
        });
        setLast7(Object.values(map));
        setByCategory((data.byCategory || []).map((x) => ({ name: x._id, value: x.total })));
        setMonthlyTrend(data.monthlyTrend || []);
        
        // Fetch recent transactions
        const { data: txData } = await api.get('/transactions', { params: { page: 1, limit: 7 } });
        setRecentTransactions(txData.items || []);
        
        // Fetch current month stats
        const currentMonth = new Date().toISOString().slice(0,7);
        const start = new Date(currentMonth + '-01').toISOString();
        const end = new Date(new Date(currentMonth + '-01').setMonth(new Date(currentMonth + '-01').getMonth() + 1)).toISOString();
        const { data: monthData } = await api.get('/transactions', { params: { page: 1, limit: 1000, start, end } });
        const monthItems = monthData.items || [];
        const monthIncome = monthItems.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const monthExpense = monthItems.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
        setCurrentMonthStats({ income: monthIncome, expense: monthExpense });
        
        // Fetch monthly budget info
        try {
          const { data: budgetData } = await api.get('/budget');
          const monthly = budgetData.find(b => b.category === 'Monthly');
          if (monthly) {
            const { data: progressData } = await api.get(`/budget/progress/${currentMonth}`);
            const totalSpent = (progressData || []).reduce((sum, p) => sum + (p.spent || 0), 0);
            setMonthlyBudget({ limit: monthly.limit || 0, spent: totalSpent });
          }
          
            // Fetch category budgets (excluding Monthly)
          const categories = budgetData.filter(b => b.category !== 'Monthly');
          
          // Fetch spending progress for current month
          try {
            const { data: progressData } = await api.get(`/budget/progress/${currentMonth}`);
            const progressMap = Object.fromEntries((progressData || []).map(p => [p.category, p.spent]));
            
            // Combine budget data with spending
            const enriched = categories.map(b => ({
              ...b,
              spent: progressMap[b.category] || 0
            }));
            setCategoryBudgets(enriched);
          } catch (err) {
            console.error('Failed to load progress', err);
            setCategoryBudgets(categories);
          }
        } catch (err) {
          console.error('Failed to load budget', err);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    })();
  }, []);

  const COLORS = ['#60a5fa', '#f472b6', '#facc15', '#34d399', '#f87171', '#a78bfa'];

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const monthSavings = currentMonthStats.income - currentMonthStats.expense;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Header */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white/80 dark:border-white/10 dark:bg-white/5 backdrop-blur flex items-center justify-between">
        <div>
          <div className="text-sm opacity-70">Welcome back</div>
          <div className="text-2xl font-extrabold tracking-tight">{user?.name || 'Friend'}</div>
        </div>
        <div className="text-sm opacity-70">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{label:'Total Income', val: summary.income, color:'text-green-600 dark:text-green-400', delta:'+3.2%'}, {label:'Total Expenses', val: summary.expense, color:'text-red-600 dark:text-red-400', delta:'-1.1%'}, {label:'Total Balance', val: summary.balance, color:'text-indigo-600 dark:text-indigo-400', delta:'+0.8%'}].map((c,i)=> (
          <div key={i} className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
            <div className="text-xs opacity-70 flex items-center justify-between">
              <span>{c.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-white/80">{c.delta}</span>
            </div>
            <div className={`text-2xl font-bold ${c.color}`}>₹{c.val}</div>
          </div>
        ))}
      </div>

      {/* Middle charts (asymmetric) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-sm opacity-70 mb-2">Spending by category</div>
          <div className="h-64 overflow-x-auto md:overflow-x-visible">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="value" fill="#6366F1" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="md:col-span-5 p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-sm opacity-70 mb-2">Monthly trend</div>
          <div className="h-64 overflow-x-auto md:overflow-x-visible">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="incomeMonthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseMonthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Area type="monotone" dataKey="expense" stroke="#6366F1" fill="url(#expenseMonthGrad)" />
                <Area type="monotone" dataKey="income" stroke="#22d3ee" fill="url(#incomeMonthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Right compact cards */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Compact bar: income vs expense (last 6 months) */}
          <div className="md:col-span-8 p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
            <div className="text-sm opacity-70 mb-2">Income vs Expense (compact)</div>
            <div className="h-40 overflow-x-auto md:overflow-x-visible">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend}>
                  <XAxis dataKey="month"/>
                  <YAxis hide/>
                  <Tooltip/>
                  <Bar dataKey="income" fill="#22d3ee" radius={[4,4,0,0]} />
                  <Bar dataKey="expense" fill="#6366F1" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Circular progress: budget usage */}
          <div className="md:col-span-4 p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm opacity-70 mb-2">Budget Usage</div>
              {monthlyBudget.limit > 0 ? (
                <div className="relative w-28 h-28 mx-auto">
                  {(() => {
                    const pct = Math.min(100, Math.round((monthlyBudget.spent / monthlyBudget.limit) * 100));
                    const radius = 44; // SVG viewBox 100x100
                    const circ = 2 * Math.PI * radius;
                    const offset = circ - (pct / 100) * circ;
                    return (
                      <svg viewBox="0 0 100 100" className="w-28 h-28">
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8" />
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset} transform="rotate(-90 50 50)" />
                      </svg>
                    );
                  })()}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-xs opacity-70">{Math.round((monthlyBudget.spent/monthlyBudget.limit)*100)}%</div>
                    <div className="text-[10px] opacity-60">used</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs opacity-70">Not set</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70 mb-1">{currentMonthName} Income</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹{currentMonthStats.income}</div>
        </div>
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70 mb-1">{currentMonthName} Expense</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">₹{currentMonthStats.expense}</div>
        </div>
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-xs opacity-70 mb-1">{currentMonthName} Savings</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{monthSavings}</div>
        </div>
        {monthlyBudget.limit > 0 && (
          <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
            <div className="text-xs opacity-70 mb-1">{currentMonthName} Budget</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{Math.max(0, monthlyBudget.limit - monthlyBudget.spent)} left</div>
            <div className="mt-2">
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-white/10">
                <div className={`h-full rounded-full ${(monthlyBudget.spent/monthlyBudget.limit) >= 0.9 ? 'bg-red-500' : (monthlyBudget.spent/monthlyBudget.limit) >= 0.7 ? 'bg-orange-500' : 'bg-green-500'}`} style={{width: `${Math.min((monthlyBudget.spent/monthlyBudget.limit)*100, 100)}%`}} />
              </div>
              <div className="text-xs mt-1 opacity-70">Spent: ₹{monthlyBudget.spent} / Limit: ₹{monthlyBudget.limit}</div>
            </div>
          </div>
        )}
      </div>

      {/* Budget Cards - removed as requested */}

      {/* Category Breakdown */}
      {categoryBudgets.length > 0 && (
        <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
          <div className="text-sm font-bold mb-3">Category Budget Breakdown</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryBudgets.map((budget) => {
              const progress = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
              const statusColor = progress >= 90 ? 'bg-red-500' : progress >= 70 ? 'bg-orange-500' : 'bg-green-500';
              const textColor = progress >= 90 ? 'text-red-600 dark:text-red-400' : progress >= 70 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400';
              
              return (
                <div key={budget._id || budget.category} className="p-3 rounded-lg border border-zinc-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{budget.category}</div>
                    <div className={`text-xs font-bold ${textColor}`}>{Math.round(progress)}%</div>
                  </div>
                  <div className="mb-2">
                    <div className="h-2 rounded-full bg-zinc-200 dark:bg-white/10">
                      <div className={`h-full rounded-full ${statusColor}`} style={{width: `${Math.min(progress, 100)}%`}} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs opacity-70">
                    <span>Spent: ₹{budget.spent || 0}</span>
                    <span>Limit: ₹{budget.limit}</span>
                  </div>
                  {progress >= 90 && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400">⚠️ Budget limit almost reached!</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom table */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm opacity-70">Recent Transactions</div>
          <div className="flex items-center gap-2">
            <a href="/transactions" className="text-sm underline">View All</a>
            <a href="/transactions" className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black">Add New</a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Category</th>
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center opacity-70">No recent transactions</td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx._id} className="border-t border-zinc-100 dark:border-white/10">
                    <td className="py-2">{tx.title}</td>
                    <td className="py-2">{tx.category || '-'}</td>
                    <td className="py-2 capitalize">{tx.type}</td>
                    <td className={`py-2 font-medium ${tx.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      ₹{tx.amount}
                    </td>
                    <td className="py-2">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-2">
                      <a href="/transactions" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        Edit
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


