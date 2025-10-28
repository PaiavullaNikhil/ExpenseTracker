import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="min-h-svh grid place-items-center p-6 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white">
      <form onSubmit={onSubmit} className="w-full max-w-sm p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <input className="w-full mb-3 px-3 py-2 rounded bg-transparent border border-white/10" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input className="w-full mb-4 px-3 py-2 rounded bg-transparent border border-white/10" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
        <button className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-semibold">Login</button>
        <div className="text-xs opacity-70 mt-3">No account? <Link to="/signup" className="underline">Sign up</Link></div>
      </form>
    </div>
  );
}


