import { Habit } from '../entities/habit.js';

export interface IHabitRepository {
  save(habit: Habit): Promise<void>;
  findAll(): Promise<Habit[]>;
  findById(id: string): Promise<Habit | null>;
  delete(id: string): Promise<void>;
}
