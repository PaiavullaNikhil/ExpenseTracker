import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : { email: true, alerts: true, budget: true };
  });
  const [feedback, setFeedback] = useState({ rating: 0, message: '' });
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);

  function saveSettings(e) {
    e.preventDefault();
    setSaving(true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setShowToast(true);
    setTimeout(() => { setShowToast(false); setSaving(false); }, 2000);
  }

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  function backupData() {
    alert('Downloading data backup...');
  }

  function exportCSV() {
    alert('Exporting to CSV...');
  }

  function importCSV() {
    alert('CSV import coming soon');
  }

  function toggle2FA() {
    alert('Two-factor authentication coming soon');
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 px-4 py-3 rounded-lg bg-green-600 text-white z-50 shadow-lg animate-pulse">
          Settings saved! ✓
        </div>
      )}

      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Theme */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Theme</h3>
        <div className="grid grid-cols-3 gap-2">
          {['light', 'dark', 'system'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-2 rounded-lg border ${
                theme === t
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black'
                  : 'border-zinc-300 dark:border-white/10'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="text-xs opacity-70 mt-2">Current: {theme}</div>
      </div>

      {/* Notifications */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email Reports</div>
              <div className="text-xs opacity-70">Weekly summary emails</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium">Budget Alerts</div>
              <div className="text-xs opacity-70">Notify when nearing limits</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.alerts}
              onChange={(e) => setNotifications({ ...notifications, alerts: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium">Budget Warnings</div>
              <div className="text-xs opacity-70">Critical spending alerts</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.budget}
              onChange={(e) => setNotifications({ ...notifications, budget: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Data Management</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={backupData} className="px-4 py-3 rounded-lg border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 font-semibold hover:bg-zinc-50 dark:hover:bg-white/5">
            Backup Data
          </button>
          <button onClick={exportCSV} className="px-4 py-3 rounded-lg border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 font-semibold hover:bg-zinc-50 dark:hover:bg-white/5">
            Export CSV
          </button>
        </div>
        <button onClick={importCSV} className="w-full mt-2 px-4 py-3 rounded-lg border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 font-semibold hover:bg-zinc-50 dark:hover:bg-white/5">
          Import CSV
        </button>
        <div className="text-xs opacity-70 mt-2">Import/Export your transaction data</div>
      </div>

      {/* Security */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Security</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Two-Factor Authentication</div>
            <div className="text-xs opacity-70">Add an extra layer of security</div>
          </div>
          <button onClick={toggle2FA} className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/10">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Feedback */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur">
        <h3 className="font-bold mb-3">Rate Your Experience</h3>
        <div className="mb-3">
          <div className="text-sm mb-2">How would you rate ExpenseTracker?</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setFeedback({ ...feedback, rating: star })}
                className="text-2xl"
              >
                {feedback.rating >= star ? '⭐' : '☆'}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="text-sm opacity-70 mb-1 block">Optional Feedback</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-900 dark:bg-transparent dark:text-white dark:border-white/10 resize-none"
            placeholder="Tell us what you think..."
            value={feedback.message}
            onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
          />
        </div>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black font-semibold">
          Submit Feedback
        </button>
      </div>

      {/* Save Button */}
      <button onClick={saveSettings} disabled={saving} className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black dark:bg-gradient-to-r dark:from-indigo-500 dark:to-cyan-400 dark:text-black font-bold text-lg disabled:opacity-50">
        {saving ? 'Saving...' : 'Save All Settings'}
      </button>
    </div>
  );
}

