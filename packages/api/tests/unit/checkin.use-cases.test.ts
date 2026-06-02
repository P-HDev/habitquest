import { describe, it, expect, beforeEach } from 'vitest';
import { CompleteHabitUseCase } from '../../src/application/use-cases/complete-habit.use-case';
import { UndoHabitUseCase } from '../../src/application/use-cases/undo-habit.use-case';
import { ListTodayHabitsUseCase } from '../../src/application/use-cases/list-today-habits.use-case';
import { Habit } from '../../src/domain/entities/habit';
import { IHabitRepository } from '../../src/domain/repositories/habit.repository';
import { Checkin, ICheckinRepository } from '../../src/domain/repositories/checkin.repository';

class InMemoryHabitRepository implements IHabitRepository {
  habits: Habit[] = [];
  async save(habit: Habit) { this.habits.push(habit); }
  async findAll() { return this.habits.filter((h) => h.active); }
  async findById(id: string) { return this.habits.find((h) => h.id === id) || null; }
  async delete(id: string) { const h = this.habits.find((x) => x.id === id); if (h) h.active = false; }
}

class InMemoryCheckinRepository implements ICheckinRepository {
  checkins: Checkin[] = [];
  async save(checkin: Checkin) { this.checkins.push(checkin); }
  async remove(habitId: string, date: string) {
    this.checkins = this.checkins.filter((c) => !(c.habitId === habitId && c.date === date));
  }
  async findByHabitAndDate(habitId: string, date: string) {
    return this.checkins.find((c) => c.habitId === habitId && c.date === date) || null;
  }
  async findDatesByHabit(habitId: string) {
    return this.checkins.filter((c) => c.habitId === habitId).map((c) => c.date).sort().reverse();
  }
  async countByHabit(habitId: string) {
    return this.checkins.filter((c) => c.habitId === habitId).length;
  }
}

function makeHabit(id: string, name = 'Test'): Habit {
  return { id, name, description: null, targetDays: 30, icon: '🎯', active: true, createdAt: new Date() };
}

describe('CompleteHabitUseCase', () => {
  let habitRepo: InMemoryHabitRepository;
  let checkinRepo: InMemoryCheckinRepository;
  let useCase: CompleteHabitUseCase;

  beforeEach(() => {
    habitRepo = new InMemoryHabitRepository();
    checkinRepo = new InMemoryCheckinRepository();
    useCase = new CompleteHabitUseCase(habitRepo, checkinRepo);
  });

  it('should complete habit for today', async () => {
    habitRepo.habits.push(makeHabit('h1'));
    const result = await useCase.execute('h1', '2026-06-02');

    expect(result.habitId).toBe('h1');
    expect(result.date).toBe('2026-06-02');
    expect(result.streak).toBe(1);
    expect(result.alreadyCompleted).toBe(false);
  });

  it('should return alreadyCompleted if already checked', async () => {
    habitRepo.habits.push(makeHabit('h1'));
    await useCase.execute('h1', '2026-06-02');
    const result = await useCase.execute('h1', '2026-06-02');

    expect(result.alreadyCompleted).toBe(true);
    expect(result.streak).toBe(1);
  });

  it('should throw if habit not found', async () => {
    await expect(useCase.execute('nonexistent')).rejects.toThrow('Habit not found');
  });

  it('should calculate streak for consecutive days', async () => {
    habitRepo.habits.push(makeHabit('h1'));
    await useCase.execute('h1', '2026-05-31');
    await useCase.execute('h1', '2026-06-01');
    const result = await useCase.execute('h1', '2026-06-02');

    expect(result.streak).toBe(3);
  });
});

describe('UndoHabitUseCase', () => {
  let checkinRepo: InMemoryCheckinRepository;
  let useCase: UndoHabitUseCase;

  beforeEach(() => {
    checkinRepo = new InMemoryCheckinRepository();
    useCase = new UndoHabitUseCase(checkinRepo);
  });

  it('should remove checkin for today', async () => {
    checkinRepo.checkins.push({ habitId: 'h1', date: '2026-06-02' });
    const result = await useCase.execute('h1', '2026-06-02');

    expect(result.removed).toBe(true);
    expect(checkinRepo.checkins).toHaveLength(0);
  });

  it('should return removed false if no checkin', async () => {
    const result = await useCase.execute('h1', '2026-06-02');
    expect(result.removed).toBe(false);
  });
});

describe('ListTodayHabitsUseCase', () => {
  let habitRepo: InMemoryHabitRepository;
  let checkinRepo: InMemoryCheckinRepository;
  let useCase: ListTodayHabitsUseCase;

  beforeEach(() => {
    habitRepo = new InMemoryHabitRepository();
    checkinRepo = new InMemoryCheckinRepository();
    useCase = new ListTodayHabitsUseCase(habitRepo, checkinRepo);
  });

  it('should return empty when no habits', async () => {
    const result = await useCase.execute('2026-06-02');
    expect(result).toEqual([]);
  });

  it('should return habits with completedToday false', async () => {
    habitRepo.habits.push(makeHabit('h1', 'Gym'));
    const result = await useCase.execute('2026-06-02');

    expect(result).toHaveLength(1);
    expect(result[0].habit.name).toBe('Gym');
    expect(result[0].completedToday).toBe(false);
    expect(result[0].streak).toBe(0);
  });

  it('should mark completedToday when checked in', async () => {
    habitRepo.habits.push(makeHabit('h1'));
    checkinRepo.checkins.push({ habitId: 'h1', date: '2026-06-02' });

    const result = await useCase.execute('2026-06-02');
    expect(result[0].completedToday).toBe(true);
    expect(result[0].streak).toBe(1);
  });

  it('should include totalCompleted count', async () => {
    habitRepo.habits.push(makeHabit('h1'));
    checkinRepo.checkins.push(
      { habitId: 'h1', date: '2026-05-30' },
      { habitId: 'h1', date: '2026-05-31' },
      { habitId: 'h1', date: '2026-06-01' },
      { habitId: 'h1', date: '2026-06-02' },
    );

    const result = await useCase.execute('2026-06-02');
    expect(result[0].totalCompleted).toBe(4);
    expect(result[0].streak).toBe(4);
  });
});
