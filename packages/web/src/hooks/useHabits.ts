import { useState, useEffect, useCallback } from 'react';
import { Habit, fetchHabits, createHabit } from '../services/habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHabits();
      setHabits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar hábitos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (data: {
    name: string;
    targetDays: number;
    description?: string;
    icon?: string;
  }) => {
    const habit = await createHabit(data);
    setHabits((prev) => [...prev, habit]);
    return habit;
  };

  return { habits, loading, error, reload: load, add };
}
