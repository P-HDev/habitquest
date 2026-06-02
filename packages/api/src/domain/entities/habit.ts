export interface Habit {
  id: string;
  name: string;
  description: string | null;
  targetDays: number;
  icon: string;
  active: boolean;
  createdAt: Date;
}

export function createHabit(params: {
  id: string;
  name: string;
  targetDays: number;
  description?: string;
  icon?: string;
}): Habit {
  if (!params.name || params.name.trim().length === 0) {
    throw new Error('Habit name is required');
  }

  if (params.name.trim().length > 100) {
    throw new Error('Habit name must be 100 characters or less');
  }

  if (params.targetDays < 1) {
    throw new Error('Target days must be at least 1');
  }

  if (params.targetDays > 365) {
    throw new Error('Target days must be 365 or less');
  }

  return {
    id: params.id,
    name: params.name.trim(),
    description: params.description?.trim() || null,
    targetDays: params.targetDays,
    icon: params.icon || '🎯',
    active: true,
    createdAt: new Date(),
  };
}
