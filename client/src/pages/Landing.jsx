import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-svh grid place-items-center bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white">
      <div className="text-center px-6">
        <div className="inline-block px-4 py-1 rounded-full text-xs border border-white/10 bg-white/5 mb-4">Personal Finance Assistant</div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Track your money
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400"> smartly</span>
        </h1>
        <p className="opacity-80 mt-4 max-w-2xl mx-auto">Visualize spending, set budgets, and gain insights with a beautiful, blazing-fast dashboard.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/login" className="px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-semibold">Get Started</Link>
          <Link to="/signup" className="px-5 py-3 rounded-lg border border-white/10 bg-white/5">Create Account</Link>
        </div>
      </div>
    </div>
  );
}


