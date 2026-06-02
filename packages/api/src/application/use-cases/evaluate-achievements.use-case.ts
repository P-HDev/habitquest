import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';
import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';
import { Achievement } from '../../domain/entities/achievement.js';

export interface EvaluateAchievementsResult {
  newlyUnlocked: Achievement[];
}

export class EvaluateAchievements {
  constructor(
    private achievementRepository: IAchievementRepository,
    private checkinRepository: ICheckinRepository
  ) {}

  async execute(habitId: string): Promise<EvaluateAchievementsResult> {
    const achievements = await this.achievementRepository.findByHabit(habitId);
    if (achievements.length === 0) return { newlyUnlocked: [] };

    const totalCheckins = await this.checkinRepository.countByHabit(habitId);
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievements) {
      if (achievement.unlocked) continue;

      await this.achievementRepository.updateProgress(achievement.id!, totalCheckins);
      achievement.currentProgress = totalCheckins;

      if (achievement.isComplete()) {
        achievement.unlock();
        await this.achievementRepository.unlock(achievement.id!, achievement.unlockedAt!);
        newlyUnlocked.push(achievement);
      }
    }

    return { newlyUnlocked };
  }
}
