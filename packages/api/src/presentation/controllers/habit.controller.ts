import { Request, Response } from 'express';
import { CreateHabitUseCase } from '../../application/use-cases/create-habit.use-case.js';
import { ListHabitsUseCase } from '../../application/use-cases/list-habits.use-case.js';

export class HabitController {
  constructor(
    private readonly createHabitUseCase: CreateHabitUseCase,
    private readonly listHabitsUseCase: ListHabitsUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, targetDays, description, icon } = req.body;

      if (!name || !targetDays) {
        res.status(400).json({ error: 'name and targetDays are required' });
        return;
      }

      const habit = await this.createHabitUseCase.execute({
        name,
        targetDays: Number(targetDays),
        description,
        icon,
      });

      res.status(201).json(habit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(422).json({ error: message });
    }
  }

  async list(_req: Request, res: Response): Promise<void> {
    const habits = await this.listHabitsUseCase.execute();
    res.json(habits);
  }
}
