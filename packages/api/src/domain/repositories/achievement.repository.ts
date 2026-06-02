import { Achievement } from '../entities/achievement.js';

export interface IAchievementRepository {
  save(achievement: Achievement): Promise<void>;
  findByHabit(habitId: string): Promise<Achievement[]>;
  findAll(): Promise<Achievement[]>;
  updateProgress(id: number, progress: number): Promise<void>;
  unlock(id: number, unlockedAt: Date): Promise<void>;
}
