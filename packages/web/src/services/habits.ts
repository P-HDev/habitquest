export interface Habit {
  id: string;
  name: string;
  description: string | null;
  targetDays: number;
  icon: string;
  active: boolean;
  createdAt: string;
}

export interface TodayHabit {
  habit: Habit;
  completedToday: boolean;
  streak: number;
  totalCompleted: number;
}

import { API_BASE } from './config';

export async function fetchHabits(): Promise<Habit[]> {
  const res = await fetch(`${API_BASE}/habits`);
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
}

export async function fetchTodayHabits(): Promise<TodayHabit[]> {
  const res = await fetch(`${API_BASE}/habits/today`);
  if (!res.ok) throw new Error('Failed to fetch today habits');
  return res.json();
}

export async function createHabit(data: {
  name: string;
  targetDays: number;
  description?: string;
  icon?: string;
}): Promise<Habit> {
  const res = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create habit');
  }
  return res.json();
}

export async function checkinHabit(
  habitId: string,
): Promise<{
  streak: number;
  alreadyCompleted: boolean;
  newlyUnlocked: { title: string; description: string | null }[];
}> {
  const res = await fetch(`${API_BASE}/habits/${habitId}/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to check in');
  return res.json();
}

export async function uncheckHabit(habitId: string): Promise<{ removed: boolean }> {
  const res = await fetch(`${API_BASE}/habits/${habitId}/checkin`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to uncheck');
  return res.json();
}
