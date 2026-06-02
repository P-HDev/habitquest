import express from 'express';
import { healthRouter } from './presentation/routes/health.routes.js';
import { createHabitRouter } from './presentation/routes/habit.routes.js';
import { createCheckinRouter } from './presentation/routes/checkin.routes.js';
import { IHabitRepository } from './domain/repositories/habit.repository.js';
import { ICheckinRepository } from './domain/repositories/checkin.repository.js';

export function createApp(habitRepository?: IHabitRepository, checkinRepository?: ICheckinRepository) {
  const app = express();

  app.use(express.json());
  app.use('/health', healthRouter);
  app.use('/habits', createHabitRouter(habitRepository));
  app.use('/habits', createCheckinRouter(habitRepository, checkinRepository));

  return app;
}
