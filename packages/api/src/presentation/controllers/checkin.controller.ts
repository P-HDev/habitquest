import { Request, Response } from 'express';
import { CompleteHabitUseCase } from '../../application/use-cases/complete-habit.use-case.js';
import { UndoHabitUseCase } from '../../application/use-cases/undo-habit.use-case.js';
import { ListTodayHabitsUseCase } from '../../application/use-cases/list-today-habits.use-case.js';

export class CheckinController {
  constructor(
    private readonly completeHabit: CompleteHabitUseCase,
    private readonly undoHabit: UndoHabitUseCase,
    private readonly listTodayHabits: ListTodayHabitsUseCase,
  ) {}

  async complete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { date } = req.body;
      const result = await this.completeHabit.execute(id, date);
      res.status(result.alreadyCompleted ? 200 : 201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal error';
      const status = message === 'Habit not found' ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }

  async undo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { date } = req.body;
      const result = await this.undoHabit.execute(id, date);
      res.status(result.removed ? 200 : 404).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal error';
      res.status(500).json({ error: message });
    }
  }

  async today(req: Request, res: Response): Promise<void> {
    try {
      const date = req.query.date as string | undefined;
      const result = await this.listTodayHabits.execute(date);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal error';
      res.status(500).json({ error: message });
    }
  }
}
