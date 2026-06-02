import { randomUUID } from 'crypto';
import { Habit, createHabit } from '../../domain/entities/habit.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';

export interface CreateHabitInput {
  name: string;
  targetDays: number;
  description?: string;
  icon?: string;
}

export class CreateHabitUseCase {
  constructor(private readonly habitRepository: IHabitRepository) {}

  async execute(input: CreateHabitInput): Promise<Habit> {
    const habit = createHabit({
      id: randomUUID(),
      name: input.name,
      targetDays: input.targetDays,
      description: input.description,
      icon: input.icon,
    });

    await this.habitRepository.save(habit);
    return habit;
  }
}
