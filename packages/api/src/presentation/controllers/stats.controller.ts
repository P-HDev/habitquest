import { Request, Response } from 'express';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';
import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';
import { Streak } from '../../domain/value-objects/streak.js';

export class StatsController {
  constructor(
    private habitRepo: IHabitRepository,
    private checkinRepo: ICheckinRepository,
    private achievementRepo: IAchievementRepository,
  ) {}

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const habits = await this.habitRepo.findAll();
      const achievements = await this.achievementRepo.findAll();
      const activeHabits = habits.filter((h) => h.active);

      const unlockedCount = achievements.filter((a) => a.unlocked).length;
      const totalAchievements = achievements.length;

      // Calculate max streak across all habits
      let maxStreak = 0;
      let totalCheckins = 0;

      for (const habit of activeHabits) {
        const dates = await this.checkinRepo.findDatesByHabit(habit.id);
        totalCheckins += dates.length;
        if (dates.length > 0) {
          const sorted = [...dates].sort();
          // Calculate longest streak in history
          let current = 1;
          let longest = 1;
          for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1]);
            const curr = new Date(sorted[i]);
            const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
              current++;
              longest = Math.max(longest, current);
            } else {
              current = 1;
            }
          }
          maxStreak = Math.max(maxStreak, longest);
        }
      }

      // Today's progress
      const today = new Date().toISOString().split('T')[0];
      let completedToday = 0;
      for (const habit of activeHabits) {
        const checkin = await this.checkinRepo.findByHabitAndDate(habit.id, today);
        if (checkin) completedToday++;
      }

      res.json({
        totalHabits: activeHabits.length,
        totalCheckins,
        completedToday,
        maxStreak,
        unlockedAchievements: unlockedCount,
        totalAchievements,
        achievementPercent: totalAchievements > 0
          ? Math.round((unlockedCount / totalAchievements) * 100)
          : 0,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get stats' });
    }
  }
}
