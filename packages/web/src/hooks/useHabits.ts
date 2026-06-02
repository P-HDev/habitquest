import { useState, useEffect, useCallback } from 'react';
import { TodayHabit, fetchTodayHabits, createHabit, checkinHabit, uncheckHabit } from '../services/habits';

export interface UnlockedAchievement {
  title: string;
  description: string | null;
}

export function useHabits() {
  const [habits, setHabits] = useState<TodayHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UnlockedAchievement[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodayHabits();
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

  const add = async (data: { name: string; targetDays: number; description?: string; icon?: string }) => {
    await createHabit(data);
    await load();
  };

  const toggle = async (habitId: string, currentlyCompleted: boolean) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.habit.id === habitId
          ? { ...h, completedToday: !currentlyCompleted, streak: currentlyCompleted ? Math.max(0, h.streak - 1) : h.streak + 1 }
          : h,
      ),
    );

    try {
      if (currentlyCompleted) {
        await uncheckHabit(habitId);
      } else {
        const result = await checkinHabit(habitId);
        if (result.newlyUnlocked?.length > 0) {
          setNewlyUnlocked(result.newlyUnlocked);
          if (navigator.vibrate) navigator.vibrate(200);
        }
      }
      await load();
    } catch {
      await load();
    }
  };

  const dismissUnlocked = () => setNewlyUnlocked([]);

  return { habits, loading, error, reload: load, add, toggle, newlyUnlocked, dismissUnlocked };
}
