import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const handleSave = async () => {
    // TODO: implement update profile API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">👤 Perfil</h1>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-6 flex flex-col items-center gap-4">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
        )}

        <div className="text-center">
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Editar Perfil</h2>

        <div>
          <label className="text-sm text-gray-400">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 mt-1 text-gray-100 focus:outline-none focus:border-primary-400"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {saved ? '✓ Salvo!' : 'Salvar'}
        </button>
      </div>

      <button
        onClick={logout}
        className="w-full bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 text-red-400 py-3 rounded-lg transition-colors"
      >
        🚪 Sair da Conta
      </button>
    </div>
  );
}
