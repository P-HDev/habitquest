import { describe, it, expect } from 'vitest';
import { createHabit } from '../../src/domain/entities/habit';

describe('Habit Entity', () => {
  it('should create a valid habit', () => {
    const habit = createHabit({
      id: 'test-id',
      name: 'Exercise',
      targetDays: 30,
    });

    expect(habit.id).toBe('test-id');
    expect(habit.name).toBe('Exercise');
    expect(habit.targetDays).toBe(30);
    expect(habit.icon).toBe('🎯');
    expect(habit.active).toBe(true);
    expect(habit.description).toBeNull();
    expect(habit.createdAt).toBeInstanceOf(Date);
  });

  it('should trim the habit name', () => {
    const habit = createHabit({
      id: 'test-id',
      name: '  Read a book  ',
      targetDays: 90,
    });

    expect(habit.name).toBe('Read a book');
  });

  it('should throw if name is empty', () => {
    expect(() =>
      createHabit({ id: 'test-id', name: '', targetDays: 30 }),
    ).toThrow('Habit name is required');
  });

  it('should throw if name is only whitespace', () => {
    expect(() =>
      createHabit({ id: 'test-id', name: '   ', targetDays: 30 }),
    ).toThrow('Habit name is required');
  });

  it('should throw if name exceeds 100 characters', () => {
    const longName = 'a'.repeat(101);
    expect(() =>
      createHabit({ id: 'test-id', name: longName, targetDays: 30 }),
    ).toThrow('Habit name must be 100 characters or less');
  });

  it('should throw if targetDays is less than 1', () => {
    expect(() =>
      createHabit({ id: 'test-id', name: 'Meditate', targetDays: 0 }),
    ).toThrow('Target days must be at least 1');
  });

  it('should throw if targetDays exceeds 365', () => {
    expect(() =>
      createHabit({ id: 'test-id', name: 'Meditate', targetDays: 400 }),
    ).toThrow('Target days must be 365 or less');
  });

  it('should accept custom icon and description', () => {
    const habit = createHabit({
      id: 'test-id',
      name: 'Gym',
      targetDays: 90,
      description: 'Go to the gym every day',
      icon: '💪',
    });

    expect(habit.icon).toBe('💪');
    expect(habit.description).toBe('Go to the gym every day');
  });
});
