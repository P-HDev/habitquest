export interface StatsDTO {
  totalHabits: number;
  totalCheckins: number;
  completedToday: number;
  maxStreak: number;
  unlockedAchievements: number;
  totalAchievements: number;
  achievementPercent: number;
}

const API_BASE = '/api';

export async function fetchStats(): Promise<StatsDTO> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
