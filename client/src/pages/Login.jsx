import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-svh grid place-items-center p-6 bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Welcome back</h1>
          <p className="text-sm opacity-70 text-zinc-900 dark:text-white">Sign in to continue to ExpenseTracker</p>
        </div>

        <div className="p-8 rounded-3xl border border-zinc-200/50 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur-xl shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition" 
                  placeholder="your@email.com" 
                  type="email" 
                  value={form.email} 
                  onChange={(e)=>setForm({...form,email:e.target.value})} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition" 
                  placeholder="••••••••" 
                  type="password" 
                  value={form.password} 
                  onChange={(e)=>setForm({...form,password:e.target.value})} 
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-bold hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm opacity-70 text-zinc-900 dark:text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
