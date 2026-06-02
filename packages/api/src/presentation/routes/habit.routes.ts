import { Router } from 'express';
import { HabitController } from '../controllers/habit.controller.js';
import { CreateHabitUseCase } from '../../application/use-cases/create-habit.use-case.js';
import { ListHabitsUseCase } from '../../application/use-cases/list-habits.use-case.js';
import { SeedAchievements } from '../../application/use-cases/seed-achievements.use-case.js';
import { SQLiteHabitRepository } from '../../infrastructure/repositories/sqlite-habit.repository.js';
import { SQLiteAchievementRepository } from '../../infrastructure/repositories/sqlite-achievement.repository.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';
import { getDatabase } from '../../infrastructure/database/connection.js';

export function createHabitRouter(repository?: IHabitRepository, achievementRepo?: IAchievementRepository): Router {
  const db = getDatabase();
  const repo = repository || new SQLiteHabitRepository(db);
  const aRepo = achievementRepo || new SQLiteAchievementRepository(db);
  const createHabitUseCase = new CreateHabitUseCase(repo);
  const listHabitsUseCase = new ListHabitsUseCase(repo);
  const seedAchievements = new SeedAchievements(aRepo);
  const controller = new HabitController(createHabitUseCase, listHabitsUseCase, seedAchievements);

  const router = Router();
  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.list(req, res));
  return router;
}

export const habitRouter = createHabitRouter();
