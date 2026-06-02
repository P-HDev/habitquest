import { useAchievements } from '../hooks/useAchievements';
import { AchievementCard } from '../components/AchievementCard';

export function AchievementsPage() {
  const { unlocked, locked, loading, error } = useAchievements();

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Carregando conquistas...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const total = unlocked.length + locked.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🏆 Conquistas</h1>
        <span className="text-sm text-gray-500">
          {unlocked.length}/{total} desbloqueadas
        </span>
      </div>

      {unlocked.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-yellow-600">⭐ Desbloqueadas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unlocked.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-500">🔒 Em progresso</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locked.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </section>
      )}

      {total === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-4">🎮</p>
          <p>Crie hábitos para desbloquear conquistas!</p>
        </div>
      )}
    </div>
  );
}
