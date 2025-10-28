import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../services/api';

export default function Analytics() {
  const [incomeExpense, setIncomeExpense] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/analytics');
      setIncomeExpense([
        { name: 'Totals', income: data.totals.income, expense: data.totals.expense, balance: data.totals.balance },
      ]);
    })();
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      <div className="p-4 border border-zinc-800 rounded-lg">
        <div className="text-sm opacity-70 mb-2">Income vs Expense</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeExpense}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#34d399" />
              <Bar dataKey="expense" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="p-4 border border-zinc-800 rounded-lg">
        <div className="text-sm opacity-70 mb-2">Savings Trend (placeholder)</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeExpense}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="balance" stroke="#60a5fa" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


