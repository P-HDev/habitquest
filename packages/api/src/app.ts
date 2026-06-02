import express from 'express';
import { healthRouter } from './presentation/routes/health.routes.js';
import { createHabitRouter } from './presentation/routes/habit.routes.js';
import { IHabitRepository } from './domain/repositories/habit.repository.js';

export function createApp(habitRepository?: IHabitRepository) {
  const app = express();

  app.use(express.json());
  app.use('/health', healthRouter);
  app.use('/habits', createHabitRouter(habitRepository));

  return app;
}
