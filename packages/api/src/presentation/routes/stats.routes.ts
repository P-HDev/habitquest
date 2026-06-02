import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';
import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';
import { SQLiteHabitRepository } from '../../infrastructure/repositories/sqlite-habit.repository.js';
import { SQLiteCheckinRepository } from '../../infrastructure/repositories/sqlite-checkin.repository.js';
import { SQLiteAchievementRepository } from '../../infrastructure/repositories/sqlite-achievement.repository.js';
import { getDatabase } from '../../infrastructure/database/connection.js';

export function createStatsRouter(
  habitRepo?: IHabitRepository,
  checkinRepo?: ICheckinRepository,
  achievementRepo?: IAchievementRepository,
): Router {
  const db = getDatabase();
  const hRepo = habitRepo || new SQLiteHabitRepository(db);
  const cRepo = checkinRepo || new SQLiteCheckinRepository(db);
  const aRepo = achievementRepo || new SQLiteAchievementRepository(db);
  const controller = new StatsController(hRepo, cRepo, aRepo);

  const router = Router();
  router.get('/', (req, res) => controller.getStats(req, res));
  return router;
}
