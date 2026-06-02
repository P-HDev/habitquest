export interface Habit {
  id: string;
  name: string;
  description: string | null;
  targetDays: number;
  icon: string;
  active: boolean;
  createdAt: string;
}

const API_BASE = '/api';

export async function fetchHabits(): Promise<Habit[]> {
  const res = await fetch(`${API_BASE}/habits`);
  if (!res.ok) throw new Error('Failed to fetch habits');
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
