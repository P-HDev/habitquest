import cron from 'node-cron';
import webpush from 'web-push';
import { ISubscriptionRepository } from '../../domain/repositories/subscription.repository.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';
import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';
import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';
import { NotificationMessageBuilder } from './notification-message.service.js';

export class NotificationScheduler {
  private jobs: cron.ScheduledTask[] = [];
  private messageBuilder: NotificationMessageBuilder;

  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    habitRepo: IHabitRepository,
    checkinRepo: ICheckinRepository,
    achievementRepo: IAchievementRepository,
  ) {
    this.messageBuilder = new NotificationMessageBuilder(habitRepo, checkinRepo, achievementRepo);
  }

  async start(): Promise<void> {
    const vapidPublic = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_EMAIL || 'mailto:habitquest@example.com';

    if (!vapidPublic || !vapidPrivate) {
      console.log('[Scheduler] VAPID keys not configured. Notifications disabled.');
      return;
    }

    webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);
    await this.scheduleJobs();
    console.log('[Scheduler] Notification scheduler started.');
  }

  async scheduleJobs(): Promise<void> {
    this.stop();
    const settings = await this.subscriptionRepo.getSettings();

    if (!settings.enabled) {
      console.log('[Scheduler] Notifications disabled in settings.');
      return;
    }

    for (const hour of settings.hours) {
      const [h, m] = hour.split(':');
      const cronExpr = `${m} ${h} * * *`;
      const job = cron.schedule(cronExpr, () => this.sendNotifications());
      this.jobs.push(job);
    }

    console.log(`[Scheduler] Scheduled at: ${settings.hours.join(', ')}`);
  }

  stop(): void {
    for (const job of this.jobs) {
      job.stop();
    }
    this.jobs = [];
  }

  async sendNotifications(): Promise<void> {
    try {
      const subscriptions = await this.subscriptionRepo.findAll();
      if (subscriptions.length === 0) return;

      const message = await this.messageBuilder.buildMessage();
      const payload = JSON.stringify(message);

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            payload,
          );
        } catch (err: any) {
          if (err.statusCode === 404 || err.statusCode === 410) {
            await this.subscriptionRepo.remove(sub.endpoint);
          }
        }
      }
    } catch (error) {
      console.error('[Scheduler] Error sending notifications:', error);
    }
  }
}
