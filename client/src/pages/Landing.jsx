import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth?.() || { isAuthenticated: false };
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-svh bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-4 md:px-6 py-4 border-b border-zinc-200/50 dark:border-white/10 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg">
        <div className="font-extrabold text-xl md:text-2xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-lg font-bold">💰</div>
          <span>ExpenseTracker</span>
        </div>
        {!isAuthenticated && (
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">How It Works</a>
            <Link to="/login" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">Login</Link>
            <Link to="/signup" className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-semibold hover:shadow-lg transition">Sign Up</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-4 md:px-6 py-16 md:py-24 text-center max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
            ✨ Smart Money Management Made Simple
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Take control of your money,<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">one expense at a time</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 mb-10 max-w-3xl mx-auto">
            Track your spending, set budgets, and gain financial insights with a beautiful, blazing-fast dashboard designed for smart money management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-bold text-lg hover:shadow-xl transition-all hover:scale-105">
              Start Tracking <ArrowRight size={20} />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-zinc-300 dark:border-white/20 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5 transition">
              Learn More
            </a>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 p-6 rounded-3xl border border-zinc-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
          <div className="text-sm font-semibold opacity-70 mb-4">Live Dashboard Preview</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Income', value: '₹24,000', color: 'green', icon: '↑' },
              { label: 'Expense', value: '₹8,000', color: 'red', icon: '↓' },
              { label: 'Balance', value: '₹16,000', color: 'indigo', icon: '↔' }
            ].map((card, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-xl ${card.color === 'green' ? 'text-green-600' : card.color === 'red' ? 'text-red-600' : 'text-indigo-600'}`}>
                    {card.icon}
                  </div>
                  <span className="text-xs opacity-70">{card.label}</span>
                </div>
                <div className={`text-3xl font-bold ${card.color === 'green' ? 'text-green-600' : card.color === 'red' ? 'text-red-600' : 'text-indigo-600'}`}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 md:px-6 py-20 bg-white/30 dark:bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Why Choose ExpenseTracker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Sparkles, title: 'Visual Reports', desc: 'Beautiful charts and analytics to understand your spending patterns at a glance.' },
              { icon: TrendingUp, title: 'Smart Budgets', desc: 'Set limits by category and get alerts when you approach your spending limits.' },
              { icon: Shield, title: 'Secure Login', desc: 'Your data is encrypted and secure. We never share your financial information.' },
              { icon: Zap, title: 'Cloud Sync', desc: 'Access your expenses anywhere, anytime. Your data is safe in the cloud.' },
            ].map((f, i) => (
              <div key={i} className="group p-6 rounded-3xl border border-zinc-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl hover:shadow-xl transition-all hover:scale-105">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <f.icon className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 md:px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your free account in seconds with just your name and email.' },
              { step: '2', title: 'Add Expenses', desc: 'Record your income and expenses with our intuitive interface.' },
              { step: '3', title: 'Watch Analytics', desc: 'See insights and trends grow over time with beautiful visualizations.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="font-bold text-2xl mb-3">{item.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-6 py-24 bg-zinc-900 dark:bg-zinc-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to take control of your finances?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-10">Join thousands of users managing their money smarter every day.</p>
          <Link to="/signup" className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white text-indigo-600 font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-6 py-12 border-t border-zinc-200/50 dark:border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-lg font-bold">💰</div>
            ExpenseTracker
          </div>
          <div className="flex flex-wrap gap-6 text-sm opacity-70">
            <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">About</a>
            <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact</a>
            <a href="#terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms</a>
            <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
