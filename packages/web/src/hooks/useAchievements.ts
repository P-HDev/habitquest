import { useState, useEffect, useCallback } from 'react';
import { AchievementDTO, fetchAchievements } from '../services/achievements';

export function useAchievements() {
  const [achievements, setAchievements] = useState<AchievementDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAchievements();
      setAchievements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conquistas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return { achievements, unlocked, locked, loading, error, reload: load };
}
