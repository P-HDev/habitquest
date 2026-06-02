import { Request, Response } from 'express';
import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';

export class AchievementController {
  constructor(private achievementRepository: IAchievementRepository) {}

  async list(_req: Request, res: Response): Promise<void> {
    const achievements = await this.achievementRepository.findAll();
    res.json(
      achievements.map((a) => ({
        id: a.id,
        habitId: a.habitId,
        title: a.title,
        description: a.description,
        targetDays: a.targetDays,
        currentProgress: a.currentProgress,
        progressPercent: a.progressPercent(),
        unlocked: a.unlocked,
        unlockedAt: a.unlockedAt?.toISOString() || null,
      }))
    );
  }

  async listByHabit(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const achievements = await this.achievementRepository.findByHabit(id);
    res.json(
      achievements.map((a) => ({
        id: a.id,
        habitId: a.habitId,
        title: a.title,
        description: a.description,
        targetDays: a.targetDays,
        currentProgress: a.currentProgress,
        progressPercent: a.progressPercent(),
        unlocked: a.unlocked,
        unlockedAt: a.unlockedAt?.toISOString() || null,
      }))
    );
  }
}
