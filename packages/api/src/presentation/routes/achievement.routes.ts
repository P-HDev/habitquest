import { Router } from 'express';
import { AchievementController } from '../controllers/achievement.controller.js';
import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';
import { SQLiteAchievementRepository } from '../../infrastructure/repositories/sqlite-achievement.repository.js';
import { getDatabase } from '../../infrastructure/database/connection.js';

export function createAchievementRouter(achievementRepo?: IAchievementRepository): Router {
  const repo = achievementRepo || new SQLiteAchievementRepository(getDatabase());
  const controller = new AchievementController(repo);

  const router = Router();
  router.get('/', (req, res) => controller.list(req, res));
  router.get('/:id', (req, res) => controller.listByHabit(req, res));
  return router;
}
