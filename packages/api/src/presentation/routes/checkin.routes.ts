import { Router } from 'express';
import { CheckinController } from '../controllers/checkin.controller.js';
import { CompleteHabitUseCase } from '../../application/use-cases/complete-habit.use-case.js';
import { UndoHabitUseCase } from '../../application/use-cases/undo-habit.use-case.js';
import { ListTodayHabitsUseCase } from '../../application/use-cases/list-today-habits.use-case.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';
import { SQLiteHabitRepository } from '../../infrastructure/repositories/sqlite-habit.repository.js';
import { SQLiteCheckinRepository } from '../../infrastructure/repositories/sqlite-checkin.repository.js';
import { getDatabase } from '../../infrastructure/database/connection.js';

export function createCheckinRouter(
  habitRepo?: IHabitRepository,
  checkinRepo?: ICheckinRepository,
): Router {
  const db = getDatabase();
  const hRepo = habitRepo || new SQLiteHabitRepository(db);
  const cRepo = checkinRepo || new SQLiteCheckinRepository(db);

  const completeHabit = new CompleteHabitUseCase(hRepo, cRepo);
  const undoHabit = new UndoHabitUseCase(cRepo);
  const listTodayHabits = new ListTodayHabitsUseCase(hRepo, cRepo);
  const controller = new CheckinController(completeHabit, undoHabit, listTodayHabits);

  const router = Router();
  router.get('/today', (req, res) => controller.today(req, res));
  router.post('/:id/checkin', (req, res) => controller.complete(req, res));
  router.delete('/:id/checkin', (req, res) => controller.undo(req, res));
  return router;
}
