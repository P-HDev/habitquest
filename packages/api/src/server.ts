import { createApp } from './app.js';
import { NotificationScheduler } from './infrastructure/services/notification-scheduler.js';
import { SQLiteSubscriptionRepository } from './infrastructure/repositories/sqlite-subscription.repository.js';
import { SQLiteHabitRepository } from './infrastructure/repositories/sqlite-habit.repository.js';
import { SQLiteCheckinRepository } from './infrastructure/repositories/sqlite-checkin.repository.js';
import { SQLiteAchievementRepository } from './infrastructure/repositories/sqlite-achievement.repository.js';
import { getDatabase } from './infrastructure/database/connection.js';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, async () => {
  console.log(`🏆 HabitQuest API running on port ${PORT}`);

  const db = getDatabase();
  const scheduler = new NotificationScheduler(
    new SQLiteSubscriptionRepository(db),
    new SQLiteHabitRepository(db),
    new SQLiteCheckinRepository(db),
    new SQLiteAchievementRepository(db),
  );
  await scheduler.start();
});
