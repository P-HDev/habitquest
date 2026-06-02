import { useState, useEffect } from 'react';
import { getNotificationSettings, updateNotificationSettings } from '../services/notifications';

export function SettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [hours, setHours] = useState<string[]>(['08:00', '14:00', '21:00']);
  const [newHour, setNewHour] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getNotificationSettings()
      .then((settings) => {
        setEnabled(settings.enabled);
        setHours(settings.hours);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await updateNotificationSettings(enabled, hours);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      // silently fail
    }
  };

  const addHour = () => {
    if (newHour && !hours.includes(newHour)) {
      const updated = [...hours, newHour].sort();
      setHours(updated);
      setNewHour('');
    }
  };

  const removeHour = (hour: string) => {
    setHours(hours.filter((h) => h !== hour));
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">⚙️ Configurações</h1>

      <section className="bg-dark-surface border border-dark-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">🔔 Notificações</h2>

        <div className="flex items-center justify-between">
          <span className="text-sm">Ativar lembretes</span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              enabled ? 'bg-primary-600' : 'bg-gray-600'
            }`}
            data-testid="toggle-enabled"
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="text-sm text-gray-400 block mb-2">Horários de lembrete</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {hours.map((hour) => (
              <span
                key={hour}
                className="bg-primary-900/50 border border-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {hour}
                <button
                  onClick={() => removeHour(hour)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="time"
              value={newHour}
              onChange={(e) => setNewHour(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded px-3 py-1 text-sm"
              data-testid="time-input"
            />
            <button
              onClick={addHour}
              disabled={!newHour}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          {saved ? '✓ Salvo!' : 'Salvar Configurações'}
        </button>
      </section>
    </div>
  );
}
