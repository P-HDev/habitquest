import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';
import { Streak } from '../../domain/value-objects/streak.js';

export interface CompleteHabitResult {
  habitId: string;
  date: string;
  streak: number;
  alreadyCompleted: boolean;
}

export class CompleteHabitUseCase {
  constructor(
    private readonly habitRepository: IHabitRepository,
    private readonly checkinRepository: ICheckinRepository,
  ) {}

  async execute(habitId: string, date?: string): Promise<CompleteHabitResult> {
    const habit = await this.habitRepository.findById(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const today = date || toDateString(new Date());
    const existing = await this.checkinRepository.findByHabitAndDate(habitId, today);

    if (existing) {
      const dates = await this.checkinRepository.findDatesByHabit(habitId);
      const streak = Streak.fromDates(dates, new Date(today + 'T00:00:00.000Z'));
      return { habitId, date: today, streak: streak.value, alreadyCompleted: true };
    }

    await this.checkinRepository.save({ habitId, date: today });

    const dates = await this.checkinRepository.findDatesByHabit(habitId);
    const streak = Streak.fromDates(dates, new Date(today + 'T00:00:00.000Z'));

    return { habitId, date: today, streak: streak.value, alreadyCompleted: false };
  }
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
