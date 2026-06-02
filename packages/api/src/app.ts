import express from 'express';
import { healthRouter } from './presentation/routes/health.routes.js';
import { createHabitRouter } from './presentation/routes/habit.routes.js';
import { createCheckinRouter } from './presentation/routes/checkin.routes.js';
import { createAchievementRouter } from './presentation/routes/achievement.routes.js';
import { IHabitRepository } from './domain/repositories/habit.repository.js';
import { ICheckinRepository } from './domain/repositories/checkin.repository.js';
import { IAchievementRepository } from './domain/repositories/achievement.repository.js';

export interface AppDependencies {
  habitRepository?: IHabitRepository;
  checkinRepository?: ICheckinRepository;
  achievementRepository?: IAchievementRepository;
}

export function createApp(deps?: AppDependencies) {
  const app = express();

  app.use(express.json());
  app.use('/health', healthRouter);
  app.use('/habits', createHabitRouter(deps?.habitRepository, deps?.achievementRepository));
  app.use('/habits', createCheckinRouter(deps?.habitRepository, deps?.checkinRepository, deps?.achievementRepository));
  app.use('/achievements', createAchievementRouter(deps?.achievementRepository));

  return app;
}
