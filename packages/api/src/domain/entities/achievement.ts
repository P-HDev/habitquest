export interface Achievement {
  id?: number;
  habitId: string;
  title: string;
  description: string | null;
  targetDays: number;
  currentProgress: number;
  unlocked: boolean;
  unlockedAt: Date | null;
  progressPercent(): number;
  unlock(): void;
  isComplete(): boolean;
}

export function createAchievement(params: {
  id?: number;
  habitId: string;
  title: string;
  description?: string;
  targetDays: number;
  currentProgress?: number;
  unlocked?: boolean;
  unlockedAt?: Date | null;
}): Achievement {
  if (!params.habitId || params.habitId.trim().length === 0) {
    throw new Error('Habit ID is required');
  }

  if (!params.title || params.title.trim().length === 0) {
    throw new Error('Achievement title is required');
  }

  if (params.targetDays < 1) {
    throw new Error('Target days must be at least 1');
  }

  const achievement: Achievement = {
    id: params.id,
    habitId: params.habitId,
    title: params.title.trim(),
    description: params.description?.trim() || null,
    targetDays: params.targetDays,
    currentProgress: params.currentProgress ?? 0,
    unlocked: params.unlocked ?? false,
    unlockedAt: params.unlockedAt ?? null,

    progressPercent() {
      return Math.min(100, Math.round((this.currentProgress / this.targetDays) * 100));
    },

    unlock() {
      if (this.unlocked) return;
      this.unlocked = true;
      this.unlockedAt = new Date();
    },

    isComplete() {
      return this.currentProgress >= this.targetDays;
    },
  };

  return achievement;
}

export const MILESTONE_TARGETS = [7, 21, 30, 60, 90, 180, 365];

export function generateMilestonesForHabit(
  habitId: string,
  habitName: string,
  habitTargetDays: number
): Achievement[] {
  return MILESTONE_TARGETS
    .filter((t) => t <= habitTargetDays)
    .map((target) =>
      createAchievement({
        habitId,
        title: `${habitName} — ${target} dias`,
        description: `Complete ${target} check-ins no hábito "${habitName}"`,
        targetDays: target,
      })
    );
}
