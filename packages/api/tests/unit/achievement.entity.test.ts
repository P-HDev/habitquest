import { describe, it, expect } from 'vitest';
import {
  Achievement,
  createAchievement,
  MILESTONE_TARGETS,
  generateMilestonesForHabit,
} from '../../src/domain/entities/achievement.js';

describe('Achievement Entity', () => {
  describe('createAchievement', () => {
    it('creates a valid achievement', () => {
      const achievement = createAchievement({
        habitId: 'habit-1',
        title: 'Primeira Semana',
        description: '7 dias consecutivos',
        targetDays: 7,
      });

      expect(achievement.habitId).toBe('habit-1');
      expect(achievement.title).toBe('Primeira Semana');
      expect(achievement.description).toBe('7 dias consecutivos');
      expect(achievement.targetDays).toBe(7);
      expect(achievement.currentProgress).toBe(0);
      expect(achievement.unlocked).toBe(false);
      expect(achievement.unlockedAt).toBeNull();
    });

    it('throws if title is empty', () => {
      expect(() =>
        createAchievement({ habitId: 'h1', title: '', targetDays: 7 })
      ).toThrow('Achievement title is required');
    });

    it('throws if targetDays < 1', () => {
      expect(() =>
        createAchievement({ habitId: 'h1', title: 'Test', targetDays: 0 })
      ).toThrow('Target days must be at least 1');
    });

    it('throws if habitId is empty', () => {
      expect(() =>
        createAchievement({ habitId: '', title: 'Test', targetDays: 7 })
      ).toThrow('Habit ID is required');
    });
  });

  describe('Achievement methods', () => {
    it('calculates progress percentage', () => {
      const achievement = createAchievement({
        habitId: 'h1',
        title: 'Test',
        targetDays: 10,
      });
      achievement.currentProgress = 5;
      expect(achievement.progressPercent()).toBe(50);
    });

    it('caps progress percentage at 100', () => {
      const achievement = createAchievement({
        habitId: 'h1',
        title: 'Test',
        targetDays: 10,
      });
      achievement.currentProgress = 15;
      expect(achievement.progressPercent()).toBe(100);
    });

    it('unlocks achievement', () => {
      const achievement = createAchievement({
        habitId: 'h1',
        title: 'Test',
        targetDays: 7,
      });
      achievement.currentProgress = 7;
      achievement.unlock();

      expect(achievement.unlocked).toBe(true);
      expect(achievement.unlockedAt).toBeInstanceOf(Date);
    });

    it('does not re-unlock already unlocked achievement', () => {
      const achievement = createAchievement({
        habitId: 'h1',
        title: 'Test',
        targetDays: 7,
      });
      achievement.currentProgress = 7;
      achievement.unlock();
      const firstUnlock = achievement.unlockedAt;

      achievement.unlock();
      expect(achievement.unlockedAt).toBe(firstUnlock);
    });

    it('isComplete returns true when progress >= target', () => {
      const achievement = createAchievement({
        habitId: 'h1',
        title: 'Test',
        targetDays: 7,
      });
      achievement.currentProgress = 7;
      expect(achievement.isComplete()).toBe(true);
    });

    it('isComplete returns false when progress < target', () => {
      const achievement = createAchievement({
        habitId: 'h1',
        title: 'Test',
        targetDays: 7,
      });
      achievement.currentProgress = 6;
      expect(achievement.isComplete()).toBe(false);
    });
  });

  describe('MILESTONE_TARGETS', () => {
    it('has predefined milestones', () => {
      expect(MILESTONE_TARGETS).toEqual([7, 21, 30, 60, 90, 180, 365]);
    });
  });

  describe('generateMilestonesForHabit', () => {
    it('generates achievements for milestones <= habit targetDays', () => {
      const milestones = generateMilestonesForHabit('habit-1', 'Meditar', 90);
      expect(milestones).toHaveLength(5); // 7, 21, 30, 60, 90
      expect(milestones[0].targetDays).toBe(7);
      expect(milestones[0].title).toBe('Meditar — 7 dias');
      expect(milestones[4].targetDays).toBe(90);
    });

    it('generates all milestones for 365-day habit', () => {
      const milestones = generateMilestonesForHabit('h1', 'Correr', 365);
      expect(milestones).toHaveLength(7);
    });

    it('generates only 7-day milestone for short habit', () => {
      const milestones = generateMilestonesForHabit('h1', 'Quick', 7);
      expect(milestones).toHaveLength(1);
      expect(milestones[0].targetDays).toBe(7);
    });

    it('generates no milestones if targetDays < 7', () => {
      const milestones = generateMilestonesForHabit('h1', 'Tiny', 3);
      expect(milestones).toHaveLength(0);
    });
  });
});
