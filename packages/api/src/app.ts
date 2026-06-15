import express from 'express';
import cors from 'cors';
import { healthRouter } from './presentation/routes/health.routes.js';
import { createHabitRouter } from './presentation/routes/habit.routes.js';
import { createCheckinRouter } from './presentation/routes/checkin.routes.js';
import { createAchievementRouter } from './presentation/routes/achievement.routes.js';
import { createNotificationRouter } from './presentation/routes/notification.routes.js';
import { createStatsRouter } from './presentation/routes/stats.routes.js';
import { createAuthRouter } from './presentation/routes/auth.routes.js';
import { IHabitRepository } from './domain/repositories/habit.repository.js';
import { ICheckinRepository } from './domain/repositories/checkin.repository.js';
import { IAchievementRepository } from './domain/repositories/achievement.repository.js';
import { ISubscriptionRepository } from './domain/repositories/subscription.repository.js';
import { IUserRepository } from './domain/repositories/user.repository.js';

export interface AppDependencies {
  habitRepository?: IHabitRepository;
  checkinRepository?: ICheckinRepository;
  achievementRepository?: IAchievementRepository;
  subscriptionRepository?: ISubscriptionRepository;
  userRepository?: IUserRepository;
}

export function createApp(deps?: AppDependencies) {
  const app = express();

  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173', 'http://localhost:4173'];

  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json());
  app.use('/health', healthRouter);
  app.use('/auth', createAuthRouter(deps?.userRepository));
  app.use('/habits', createHabitRouter(deps?.habitRepository, deps?.achievementRepository));
  app.use(
    '/habits',
    createCheckinRouter(
      deps?.habitRepository,
      deps?.checkinRepository,
      deps?.achievementRepository,
    ),
  );
  app.use('/achievements', createAchievementRouter(deps?.achievementRepository));
  app.use('/notifications', createNotificationRouter(deps?.subscriptionRepository));
  app.use(
    '/stats',
    createStatsRouter(deps?.habitRepository, deps?.checkinRepository, deps?.achievementRepository),
  );

  return app;
}
