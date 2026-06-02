import { describe, it, expect } from 'vitest';
import { HabitName } from '../../src/domain/value-objects/habit-name';
import { TargetDays } from '../../src/domain/value-objects/target-days';
import { Streak } from '../../src/domain/value-objects/streak';

describe('HabitName', () => {
  it('should create a valid habit name', () => {
    const name = HabitName.create('Exercise');
    expect(name.value).toBe('Exercise');
  });

  it('should trim whitespace', () => {
    const name = HabitName.create('  Meditate  ');
    expect(name.value).toBe('Meditate');
  });

  it('should throw if empty', () => {
    expect(() => HabitName.create('')).toThrow('Habit name is required');
  });

  it('should throw if only whitespace', () => {
    expect(() => HabitName.create('   ')).toThrow('Habit name is required');
  });

  it('should throw if exceeds 100 chars', () => {
    expect(() => HabitName.create('a'.repeat(101))).toThrow('Habit name must be 100 characters or less');
  });

  it('should be equal when same value', () => {
    const a = HabitName.create('Read');
    const b = HabitName.create('Read');
    expect(a.equals(b)).toBe(true);
  });
});

describe('TargetDays', () => {
  it('should create valid target days', () => {
    const target = TargetDays.create(30);
    expect(target.value).toBe(30);
  });

  it('should throw if less than 1', () => {
    expect(() => TargetDays.create(0)).toThrow('Target days must be at least 1');
  });

  it('should throw if exceeds 365', () => {
    expect(() => TargetDays.create(400)).toThrow('Target days must be 365 or less');
  });

  it('should calculate progress percentage', () => {
    const target = TargetDays.create(100);
    expect(target.progressPercent(50)).toBe(50);
    expect(target.progressPercent(100)).toBe(100);
    expect(target.progressPercent(150)).toBe(100);
  });
});

describe('Streak', () => {
  it('should calculate streak from consecutive dates', () => {
    const today = new Date('2026-06-02');
    const dates = [
      '2026-06-02',
      '2026-06-01',
      '2026-05-31',
      '2026-05-30',
    ];
    const streak = Streak.fromDates(dates, today);
    expect(streak.value).toBe(4);
  });

  it('should return 0 when no dates', () => {
    const streak = Streak.fromDates([], new Date('2026-06-02'));
    expect(streak.value).toBe(0);
  });

  it('should break streak on gap', () => {
    const today = new Date('2026-06-02');
    const dates = [
      '2026-06-02',
      '2026-06-01',
      '2026-05-29', // gap: missing 05-30
    ];
    const streak = Streak.fromDates(dates, today);
    expect(streak.value).toBe(2);
  });

  it('should return 0 if today is not checked', () => {
    const today = new Date('2026-06-02');
    const dates = ['2026-06-01', '2026-05-31'];
    const streak = Streak.fromDates(dates, today);
    expect(streak.value).toBe(0);
  });

  it('should count streak starting from yesterday if today not checked', () => {
    const today = new Date('2026-06-02');
    const dates = ['2026-06-01', '2026-05-31', '2026-05-30'];
    const streak = Streak.fromDates(dates, today, { includeYesterday: true });
    expect(streak.value).toBe(3);
  });

  it('should have display label', () => {
    const streak = Streak.fromDates(['2026-06-02'], new Date('2026-06-02'));
    expect(streak.label).toBe('🔥 1');
  });
});
