import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import TransactionCard from '../components/TransactionCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: '', type: '', category: '', start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load(p = page) {
    try {
      const { data } = await api.get('/transactions', { params: { ...filters, page: p, limit: 10 } });
      setItems(data.items || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch (err) {
      console.error('Failed to load transactions', err);
    }
  }

  const [newTx, setNewTx] = useState({ title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0,10), notes: '' });

  useEffect(() => { load(1); }, []);

  async function addTx(e) {
    e.preventDefault();
    if (Number(newTx.amount) <= 0) {
      alert('Amount must be positive');
      return;
    }
    try {
      const payload = { amount: Number(newTx.amount), type: newTx.type, date: newTx.type === 'income' ? newTx.date.slice(0,7) + '-01' : newTx.date, notes: newTx.notes };
      payload.title = newTx.type === 'income' ? 'Income' : newTx.title;
      if (newTx.type === 'expense' && newTx.category) payload.category = newTx.category;
      await api.post('/transactions', payload);
      setNewTx({ title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0,10), notes: '' });
      setShowForm(false);
      load(1);
    } catch (err) {
      alert('Failed to add transaction');
    }
  }

  async function deleteTx(item) {
    await api.delete(`/transactions/${item._id}`);
    load(page);
  }

  async function updateTx(e) {
    e.preventDefault();
    if (Number(newTx.amount) <= 0) {
      alert('Amount must be positive');
      return;
    }
    try {
      const payload = { amount: Number(newTx.amount), type: newTx.type, date: newTx.type === 'income' ? newTx.date.slice(0,7) + '-01' : newTx.date, notes: newTx.notes };
      payload.title = newTx.type === 'income' ? 'Income' : newTx.title;
      if (newTx.type === 'expense' && newTx.category) payload.category = newTx.category;
      await api.put(`/transactions/${editing._id}`, payload);
      setNewTx({ title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0,10), notes: '' });
      setEditing(null);
      setShowForm(false);
      load(1);
    } catch (err) {
      alert('Failed to update transaction');
    }
  }

  function startEdit(item) {
    setEditing(item);
    setNewTx({
      title: item.title || '',
      amount: item.amount || '',
      type: item.type || 'expense',
      category: item.category || 'Food',
      date: item.type === 'income' ? item.date.slice(0,7) : item.date,
      notes: item.notes || ''
    });
    setShowForm(true);
  }

  const categoryColors = useMemo(() => ({
    Food: '#fb923c', // orange
    Rent: '#ef4444', // red
    Travel: '#06b6d4', // cyan
    Bills: '#a78bfa', // violet
    Shopping: '#22c55e', // green
    Other: '#60a5fa',
  }), []);

  const pieData = useMemo(() => {
    const map = {};
    for (const it of items) {
      if (it.type !== 'expense') continue;
      const key = it.category || 'Other';
      map[key] = (map[key] || 0) + Number(it.amount || 0);
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [items]);

  return (
    <div className="p-6 flex flex-col gap-4">
      {/* Summary pie */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <div className="text-sm opacity-70 mb-2">Expenses by category (this page)</div>
        <div className="h-48">
          {pieData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                  {pieData.map((e,i)=> (
                    <Cell key={i} fill={categoryColors[e.name] || '#60a5fa'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full grid place-items-center text-sm opacity-70">No expense data to summarize.</div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <input className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" placeholder="Search" value={filters.q} onChange={(e)=>setFilters({...filters,q:e.target.value})} />
        <select className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white dark:border-white/10" value={filters.type} onChange={(e)=>setFilters({...filters,type:e.target.value})}>
          <option value="" className="dark:bg-zinc-900 dark:text-white">All</option>
          <option value="income" className="dark:bg-zinc-900 dark:text-white">Income</option>
          <option value="expense" className="dark:bg-zinc-900 dark:text-white">Expense</option>
        </select>
        <select className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white dark:border-white/10" value={filters.category} onChange={(e)=>setFilters({...filters,category:e.target.value})}>
          <option value="" className="dark:bg-zinc-900 dark:text-white">All Categories</option>
          <option value="Food" className="dark:bg-zinc-900 dark:text-white">Food</option>
          <option value="Travel" className="dark:bg-zinc-900 dark:text-white">Travel</option>
          <option value="Shopping" className="dark:bg-zinc-900 dark:text-white">Shopping</option>
          <option value="Bills" className="dark:bg-zinc-900 dark:text-white">Bills</option>
          <option value="Rent" className="dark:bg-zinc-900 dark:text-white">Rent</option>
          <option value="Other" className="dark:bg-zinc-900 dark:text-white">Other</option>
        </select>
        <input type="date" className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" value={filters.start} onChange={(e)=>setFilters({...filters,start:e.target.value})} />
        <input type="date" className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" value={filters.end} onChange={(e)=>setFilters({...filters,end:e.target.value})} />
        <button className="px-3 py-2 rounded bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black" onClick={() => load(1)}>Apply Filters</button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        {items.length === 0 ? (
          <div className="p-6 text-sm opacity-70">No transactions found for this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left opacity-70">
                <tr>
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Notes</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it._id} className="border-t border-zinc-100 dark:border-white/10">
                    <td className="py-2 px-3">{it.title}</td>
                    <td className="py-2 px-3 font-medium {it.type==='expense'?'text-red-500':'text-green-500'}">₹{it.amount}</td>
                    <td className="py-2 px-3">{it.type}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-1 rounded text-xs" style={{backgroundColor: (categoryColors[it.category]||'#e5e7eb')+"22", color: categoryColors[it.category]||'#475569'}}>{it.category||'Other'}</span>
                    </td>
                    <td className="py-2 px-3">{new Date(it.date).toLocaleDateString()}</td>
                    <td className="py-2 px-3">{it.notes || '-'}</td>
                    <td className="py-2 px-3">
                      <button className="text-xs px-2 py-1 rounded border border-zinc-300 dark:border-white/10 mr-2" onClick={() => startEdit(it)}>✏️</button>
                      <button className="text-xs px-2 py-1 rounded border border-zinc-300 dark:border-white/10" onClick={() => deleteTx(it)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="flex items-center justify-between p-3 text-xs">
          <div>Page {page} of {pages} • {total} results</div>
          <div className="flex gap-2">
            <button disabled={page<=1} className="px-3 py-1 rounded border border-zinc-300 disabled:opacity-50 dark:border-white/10" onClick={() => load(page-1)}>Previous</button>
            <button disabled={page>=pages} className="px-3 py-1 rounded border border-zinc-300 disabled:opacity-50 dark:border-white/10" onClick={() => load(page+1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button onClick={() => setShowForm(true)} className="fixed bottom-6 right-6 px-4 py-3 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black z-30">＋ Add Transaction</button>

      {/* Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <form onSubmit={editing ? updateTx : addTx} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 p-6 grid gap-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">{editing ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-2 py-1 text-xl">✕</button>
            </div>
            {newTx.type === 'expense' && (
              <div>
                <label className="text-sm opacity-70 mb-1 block">Title *</label>
                <input className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" placeholder="Groceries" value={newTx.title} onChange={(e)=>setNewTx({...newTx,title:e.target.value})} required />
              </div>
            )}
            <div>
              <label className="text-sm opacity-70 mb-1 block">Amount *</label>
              <input type="number" step="0.01" className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" placeholder="500" value={newTx.amount} onChange={(e)=>setNewTx({...newTx,amount:e.target.value})} required />
            </div>
            <div>
              <label className="text-sm opacity-70 mb-1 block">Type *</label>
              <select className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white dark:border-white/10" value={newTx.type} onChange={(e)=>setNewTx({...newTx,type:e.target.value})}>
                <option value="expense" className="dark:bg-zinc-900 dark:text-white">Expense</option>
                <option value="income" className="dark:bg-zinc-900 dark:text-white">Income</option>
              </select>
            </div>
            {newTx.type === 'expense' && (
              <div>
                <label className="text-sm opacity-70 mb-1 block">Category *</label>
                <select className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white dark:border-white/10" value={newTx.category} onChange={(e)=>setNewTx({...newTx,category:e.target.value})} required>
                  <option value="Food" className="dark:bg-zinc-900 dark:text-white">Food</option>
                  <option value="Travel" className="dark:bg-zinc-900 dark:text-white">Travel</option>
                  <option value="Shopping" className="dark:bg-zinc-900 dark:text-white">Shopping</option>
                  <option value="Bills" className="dark:bg-zinc-900 dark:text-white">Bills</option>
                  <option value="Rent" className="dark:bg-zinc-900 dark:text-white">Rent</option>
                  <option value="Other" className="dark:bg-zinc-900 dark:text-white">Other</option>
                </select>
              </div>
            )}
            <div>
              <label className="text-sm opacity-70 mb-1 block">{newTx.type === 'income' ? 'Month *' : 'Date *'}</label>
              {newTx.type === 'income' ? (
                <input type="month" className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" value={newTx.date.slice(0,7)} onChange={(e)=>setNewTx({...newTx,date:e.target.value})} required />
              ) : (
                <input type="date" className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" value={newTx.date} onChange={(e)=>setNewTx({...newTx,date:e.target.value})} required />
              )}
            </div>
            <div>
              <label className="text-sm opacity-70 mb-1 block">Notes</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 resize-none" placeholder="Optional notes..." value={newTx.notes} onChange={(e)=>setNewTx({...newTx,notes:e.target.value})} />
            </div>
            <div>
              <label className="text-sm opacity-70 mb-1 block">Receipt (optional)</label>
              <input type="file" accept="image/*" className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 text-xs" disabled />
              <div className="text-xs opacity-50 mt-1">Upload disabled (Cloudinary not configured)</div>
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black font-semibold">{editing ? 'Update Transaction' : 'Add Transaction'}</button>
              <button type="button" className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/10" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


