import { Router } from 'express';
import { HabitController } from '../controllers/habit.controller.js';
import { CreateHabitUseCase } from '../../application/use-cases/create-habit.use-case.js';
import { ListHabitsUseCase } from '../../application/use-cases/list-habits.use-case.js';
import { SQLiteHabitRepository } from '../../infrastructure/repositories/sqlite-habit.repository.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { getDatabase } from '../../infrastructure/database/connection.js';

export function createHabitRouter(repository?: IHabitRepository): Router {
  const repo = repository || new SQLiteHabitRepository(getDatabase());
  const createHabitUseCase = new CreateHabitUseCase(repo);
  const listHabitsUseCase = new ListHabitsUseCase(repo);
  const controller = new HabitController(createHabitUseCase, listHabitsUseCase);

  const router = Router();
  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.list(req, res));
  return router;
}

export const habitRouter = createHabitRouter();
