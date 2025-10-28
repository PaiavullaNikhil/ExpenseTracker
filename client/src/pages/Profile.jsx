import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setToken, setUser } = useAuth();
  function logout() {
    setToken(null);
    setUser(null);
  }
  return (
    <div className="p-6">
      <div className="p-4 border border-zinc-800 rounded-lg max-w-md">
        <div className="text-sm opacity-70 mb-2">User</div>
        <div className="font-semibold">{user?.name}</div>
        <div className="opacity-80">{user?.email}</div>
        <button onClick={logout} className="mt-4 px-3 py-2 rounded bg-primary">Logout</button>
      </div>
    </div>
  );
}


