import { Habit } from '../../domain/entities/habit.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';

export class ListHabitsUseCase {
  constructor(private readonly habitRepository: IHabitRepository) {}

  async execute(): Promise<Habit[]> {
    return this.habitRepository.findAll();
  }
}
