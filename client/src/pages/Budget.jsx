import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Budget() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ month: new Date().toISOString().slice(0,7), category: '', limit: '' });

  async function load() {
    const { data } = await api.get('/budget');
    setItems(data);
  }

  async function saveBudget(e) {
    e.preventDefault();
    await api.post('/budget', { ...form, limit: Number(form.limit) });
    setForm({ ...form, category: '', limit: '' });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 flex flex-col gap-4">
      <form onSubmit={saveBudget} className="flex gap-2">
        <input type="month" className="px-3 py-2 rounded bg-transparent border border-zinc-700" value={form.month} onChange={(e)=>setForm({...form,month:e.target.value})} />
        <input className="px-3 py-2 rounded bg-transparent border border-zinc-700" placeholder="Category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} />
        <input type="number" className="px-3 py-2 rounded bg-transparent border border-zinc-700" placeholder="Limit" value={form.limit} onChange={(e)=>setForm({...form,limit:e.target.value})} />
        <button className="px-3 py-2 rounded bg-primary">Save</button>
      </form>
      <div className="grid gap-3">
        {items.map((b) => {
          return (
            <div key={b._id} className="p-4 border border-zinc-800 rounded-lg">
              <div className="text-sm opacity-70">{b.month} • {b.category}</div>
              <div className="font-semibold">₹{b.limit}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


