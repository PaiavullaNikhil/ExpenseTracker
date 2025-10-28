import { useEffect, useState } from 'react';
import api from '../services/api';
import TransactionCard from '../components/TransactionCard';

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: '', type: '', category: '', start: '', end: '' });

  async function load() {
    const { data } = await api.get('/transactions', { params: { ...filters } });
    setItems(data.items);
  }

  const [newTx, setNewTx] = useState({ title: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().slice(0,10), notes: '' });

  useEffect(() => { load(); }, []);

  async function addTx(e) {
    e.preventDefault();
    await api.post('/transactions', { ...newTx, amount: Number(newTx.amount) });
    setNewTx({ title: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().slice(0,10), notes: '' });
    load();
  }

  async function deleteTx(item) {
    await api.delete(`/transactions/${item._id}`);
    load();
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2">
        <input className="px-3 py-2 rounded bg-transparent border border-zinc-700" placeholder="Search" value={filters.q} onChange={(e)=>setFilters({...filters,q:e.target.value})} />
        <select className="px-3 py-2 rounded bg-transparent border border-zinc-700" value={filters.type} onChange={(e)=>setFilters({...filters,type:e.target.value})}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="text" className="px-3 py-2 rounded bg-transparent border border-zinc-700" placeholder="Category" value={filters.category} onChange={(e)=>setFilters({...filters,category:e.target.value})} />
        <input type="date" className="px-3 py-2 rounded bg-transparent border border-zinc-700" value={filters.start} onChange={(e)=>setFilters({...filters,start:e.target.value})} />
        <input type="date" className="px-3 py-2 rounded bg-transparent border border-zinc-700" value={filters.end} onChange={(e)=>setFilters({...filters,end:e.target.value})} />
      </div>
      <div>
        <button className="px-3 py-2 rounded bg-primary" onClick={load}>Apply Filters</button>
      </div>

      <form onSubmit={addTx} className="grid grid-cols-6 gap-2 items-end border border-zinc-800 p-4 rounded-lg">
        <input className="px-3 py-2 rounded bg-transparent border border-zinc-700 col-span-2" placeholder="Title" value={newTx.title} onChange={(e)=>setNewTx({...newTx,title:e.target.value})} />
        <input type="number" className="px-3 py-2 rounded bg-transparent border border-zinc-700" placeholder="Amount" value={newTx.amount} onChange={(e)=>setNewTx({...newTx,amount:e.target.value})} />
        <select className="px-3 py-2 rounded bg-transparent border border-zinc-700" value={newTx.type} onChange={(e)=>setNewTx({...newTx,type:e.target.value})}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input className="px-3 py-2 rounded bg-transparent border border-zinc-700" placeholder="Category" value={newTx.category} onChange={(e)=>setNewTx({...newTx,category:e.target.value})} />
        <input type="date" className="px-3 py-2 rounded bg-transparent border border-zinc-700" value={newTx.date} onChange={(e)=>setNewTx({...newTx,date:e.target.value})} />
        <input className="px-3 py-2 rounded bg-transparent border border-zinc-700 col-span-5" placeholder="Notes (optional)" value={newTx.notes} onChange={(e)=>setNewTx({...newTx,notes:e.target.value})} />
        <button className="px-3 py-2 rounded bg-primary">Add</button>
      </form>

      <div className="grid gap-3">
        {items.map((it) => (
          <TransactionCard key={it._id} item={it} onDelete={deleteTx} />
        ))}
      </div>
    </div>
  );
}


