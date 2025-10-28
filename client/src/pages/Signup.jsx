import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Signup failed');
    }
  }

  return (
    <div className="min-h-svh grid place-items-center p-6 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white">
      <form onSubmit={onSubmit} className="w-full max-w-sm p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <h2 className="text-2xl font-bold mb-4">Create your account</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <input className="w-full mb-3 px-3 py-2 rounded bg-transparent border border-white/10" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input className="w-full mb-3 px-3 py-2 rounded bg-transparent border border-white/10" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input className="w-full mb-3 px-3 py-2 rounded bg-transparent border border-white/10" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
        <input className="w-full mb-4 px-3 py-2 rounded bg-transparent border border-white/10" placeholder="Confirm Password" type="password" value={form.confirm} onChange={(e)=>setForm({...form,confirm:e.target.value})} />
        <button className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-semibold">Sign Up</button>
        <div className="text-xs opacity-70 mt-3">Already have an account? <Link to="/login" className="underline">Login</Link></div>
      </form>
    </div>
  );
}


