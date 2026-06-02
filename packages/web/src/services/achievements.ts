export interface AchievementDTO {
  id: number;
  habitId: string;
  title: string;
  description: string | null;
  targetDays: number;
  currentProgress: number;
  progressPercent: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

const API_BASE = '/api';

export async function fetchAchievements(): Promise<AchievementDTO[]> {
  const res = await fetch(`${API_BASE}/achievements`);
  if (!res.ok) throw new Error('Failed to fetch achievements');
  return res.json();
}

export async function fetchAchievementsByHabit(habitId: string): Promise<AchievementDTO[]> {
  const res = await fetch(`${API_BASE}/achievements/${habitId}`);
  if (!res.ok) throw new Error('Failed to fetch achievements');
  return res.json();
}
