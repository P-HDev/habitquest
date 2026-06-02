import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';
import { generateMilestonesForHabit } from '../../domain/entities/achievement.js';

export class SeedAchievements {
  constructor(private achievementRepository: IAchievementRepository) {}

  async execute(habitId: string, habitName: string, habitTargetDays: number): Promise<void> {
    const milestones = generateMilestonesForHabit(habitId, habitName, habitTargetDays);

    for (const achievement of milestones) {
      await this.achievementRepository.save(achievement);
    }
  }
}
