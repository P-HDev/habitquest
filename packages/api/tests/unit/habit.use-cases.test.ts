import { describe, it, expect, beforeEach } from 'vitest';
import { CreateHabitUseCase } from '../../src/application/use-cases/create-habit.use-case';
import { ListHabitsUseCase } from '../../src/application/use-cases/list-habits.use-case';
import { Habit } from '../../src/domain/entities/habit';
import { IHabitRepository } from '../../src/domain/repositories/habit.repository';

class InMemoryHabitRepository implements IHabitRepository {
  private habits: Habit[] = [];

  async save(habit: Habit): Promise<void> {
    this.habits.push(habit);
  }

  async findAll(): Promise<Habit[]> {
    return this.habits.filter((h) => h.active);
  }

  async findById(id: string): Promise<Habit | null> {
    return this.habits.find((h) => h.id === id) || null;
  }

  async delete(id: string): Promise<void> {
    const habit = this.habits.find((h) => h.id === id);
    if (habit) habit.active = false;
  }
}

describe('CreateHabitUseCase', () => {
  let repository: InMemoryHabitRepository;
  let createHabit: CreateHabitUseCase;

  beforeEach(() => {
    repository = new InMemoryHabitRepository();
    createHabit = new CreateHabitUseCase(repository);
  });

  it('should create a habit and persist it', async () => {
    const habit = await createHabit.execute({
      name: 'Meditate',
      targetDays: 30,
    });

    expect(habit.name).toBe('Meditate');
    expect(habit.targetDays).toBe(30);
    expect(habit.id).toBeDefined();

    const found = await repository.findById(habit.id);
    expect(found).not.toBeNull();
    expect(found!.name).toBe('Meditate');
  });

  it('should reject invalid habit data', async () => {
    await expect(
      createHabit.execute({ name: '', targetDays: 30 }),
    ).rejects.toThrow('Habit name is required');
  });
});

describe('ListHabitsUseCase', () => {
  let repository: InMemoryHabitRepository;
  let createHabit: CreateHabitUseCase;
  let listHabits: ListHabitsUseCase;

  beforeEach(() => {
    repository = new InMemoryHabitRepository();
    createHabit = new CreateHabitUseCase(repository);
    listHabits = new ListHabitsUseCase(repository);
  });

  it('should return empty array when no habits', async () => {
    const habits = await listHabits.execute();
    expect(habits).toEqual([]);
  });

  it('should return all active habits', async () => {
    await createHabit.execute({ name: 'Read', targetDays: 30 });
    await createHabit.execute({ name: 'Gym', targetDays: 90 });

    const habits = await listHabits.execute();
    expect(habits).toHaveLength(2);
  });
});
