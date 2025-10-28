import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user, setToken, setUser } = useAuth();
  const { theme, toggle } = useTheme();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [currency, setCurrency] = useState('₹');
  const [saving, setSaving] = useState(false);

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', { name: form.name });
      setUser({ ...user, name: form.name });
      setSaving(false);
      alert('Profile updated successfully!');
      setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setSaving(false);
      alert('Failed to update profile');
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return alert('Passwords do not match');
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSaving(false);
      alert('Password changed successfully!');
      setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setSaving(false);
      alert('Failed to change password');
    }
  }

  function deleteAccount() {
    if (!confirm('Delete account? This cannot be undone.')) return;
    alert('Delete account coming soon');
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Profile Info */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Profile Information</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white">{user?.name?.charAt(0) || 'U'}</div>
          <div>
            <input type="file" accept="image/*" className="text-xs" disabled />
            <div className="text-xs opacity-50 mt-1">Avatar upload coming soon</div>
          </div>
        </div>
        <form onSubmit={saveProfile} className="grid gap-3">
          <div>
            <label className="text-sm opacity-70 mb-1 block">Name *</label>
            <input className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
          </div>
          <div>
            <label className="text-sm opacity-70 mb-1 block">Email</label>
            <input className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 opacity-70" value={form.email} readOnly />
          </div>
          <div className="text-xs opacity-50 mt-1">Joined on: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black font-semibold disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>

      {/* Change Password */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Change Password</h3>
        <form onSubmit={changePassword} className="grid gap-3">
          <div>
            <label className="text-sm opacity-70 mb-1 block">Current Password *</label>
            <input type="password" className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" placeholder="Enter current password" value={form.currentPassword} onChange={(e)=>setForm({...form,currentPassword:e.target.value})} required />
          </div>
          <div>
            <label className="text-sm opacity-70 mb-1 block">New Password *</label>
            <input type="password" className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" placeholder="Enter new password" value={form.newPassword} onChange={(e)=>setForm({...form,newPassword:e.target.value})} required />
          </div>
          <div>
            <label className="text-sm opacity-70 mb-1 block">Confirm Password *</label>
            <input type="password" className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10" placeholder="Confirm new password" value={form.confirmPassword} onChange={(e)=>setForm({...form,confirmPassword:e.target.value})} required />
          </div>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black font-semibold disabled:opacity-50">{saving ? 'Changing...' : 'Change Password'}</button>
        </form>
      </div>

      {/* Settings */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Settings</h3>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Currency</div>
              <div className="text-xs opacity-70">Choose your preferred currency</div>
            </div>
            <select value={currency} onChange={(e)=>setCurrency(e.target.value)} className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white dark:border-white/10">
              <option value="₹" className="dark:bg-zinc-900 dark:text-white">₹ (INR)</option>
              <option value="$" className="dark:bg-zinc-900 dark:text-white">$ (USD)</option>
              <option value="€" className="dark:bg-zinc-900 dark:text-white">€ (EUR)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className="text-xs opacity-70">Toggle between light and dark theme</div>
            </div>
            <button onClick={toggle} className="px-4 py-2 rounded border border-zinc-300 dark:border-white/10 text-2xl">
              {theme === 'dark' ? '🌙' : '🌞'}
            </button>
          </div>
        </div>
      </div>

      {/* Logout & Delete */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Account Actions</h3>
        <div className="flex flex-col gap-3">
          <button onClick={logout} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold">Logout</button>
          <div>
            <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Danger Zone</h4>
            <p className="text-xs opacity-70 mb-2">Permanently delete your account and all data</p>
            <button onClick={deleteAccount} className="px-4 py-2 rounded-lg border-2 border-red-600 text-red-600 dark:text-red-400 font-semibold">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}


