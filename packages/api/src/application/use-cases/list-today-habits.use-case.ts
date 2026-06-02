import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';
import { Streak } from '../../domain/value-objects/streak.js';
import { Habit } from '../../domain/entities/habit.js';

export interface TodayHabit {
  habit: Habit;
  completedToday: boolean;
  streak: number;
  totalCompleted: number;
}

export class ListTodayHabitsUseCase {
  constructor(
    private readonly habitRepository: IHabitRepository,
    private readonly checkinRepository: ICheckinRepository,
  ) {}

  async execute(date?: string): Promise<TodayHabit[]> {
    const today = date || new Date().toISOString().split('T')[0];
    const habits = await this.habitRepository.findAll();

    const results: TodayHabit[] = [];

    for (const habit of habits) {
      const checkin = await this.checkinRepository.findByHabitAndDate(habit.id, today);
      const dates = await this.checkinRepository.findDatesByHabit(habit.id);
      const totalCompleted = await this.checkinRepository.countByHabit(habit.id);
      const streak = Streak.fromDates(dates, new Date(today + 'T00:00:00.000Z'), { includeYesterday: true });

      results.push({
        habit,
        completedToday: !!checkin,
        streak: streak.value,
        totalCompleted,
      });
    }

    return results;
  }
}
