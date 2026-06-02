import { ISubscriptionRepository, PushSubscriptionData } from '../../domain/repositories/subscription.repository.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';
import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';

export interface NotificationMessage {
  title: string;
  body: string;
  tag: string;
}

export class NotificationMessageBuilder {
  constructor(
    private habitRepo: IHabitRepository,
    private checkinRepo: ICheckinRepository,
    private achievementRepo: IAchievementRepository,
  ) {}

  async buildMessage(): Promise<NotificationMessage> {
    const today = new Date().toISOString().split('T')[0];
    const habits = await this.habitRepo.findAll();
    const activeHabits = habits.filter((h) => h.active);

    let pendingCount = 0;
    for (const habit of activeHabits) {
      const checkin = await this.checkinRepo.findByHabitAndDate(habit.id, today);
      if (!checkin) pendingCount++;
    }

    // Try to find closest achievement
    const closestAchievement = await this.findClosestAchievement();

    if (pendingCount === 0) {
      return {
        title: '🎉 Dia Perfeito!',
        body: 'Parabéns! Todos os hábitos de hoje estão completos!',
        tag: 'habitquest-perfect',
      };
    }

    if (closestAchievement) {
      return {
        title: '🏆 HabitQuest',
        body: `Faltam ${closestAchievement.remaining} dias pra conquista "${closestAchievement.title}"! Hoje: ${pendingCount} hábito${pendingCount > 1 ? 's' : ''} pendente${pendingCount > 1 ? 's' : ''}.`,
        tag: 'habitquest-achievement',
      };
    }

    return {
      title: '🎯 HabitQuest',
      body: `Faltam ${pendingCount} hábito${pendingCount > 1 ? 's' : ''} pro dia perfeito!`,
      tag: 'habitquest-reminder',
    };
  }

  private async findClosestAchievement(): Promise<{ title: string; remaining: number } | null> {
    const achievements = await this.achievementRepo.findAll();
    const locked = achievements.filter((a) => !a.unlocked && a.currentProgress > 0);

    if (locked.length === 0) return null;

    let closest = locked[0];
    let minRemaining = closest.targetDays - closest.currentProgress;

    for (const a of locked) {
      const remaining = a.targetDays - a.currentProgress;
      if (remaining < minRemaining) {
        minRemaining = remaining;
        closest = a;
      }
    }

    return { title: closest.title, remaining: minRemaining };
  }
}
