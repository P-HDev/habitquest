import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { ISubscriptionRepository } from '../../domain/repositories/subscription.repository.js';
import { SQLiteSubscriptionRepository } from '../../infrastructure/repositories/sqlite-subscription.repository.js';
import { getDatabase } from '../../infrastructure/database/connection.js';

export function createNotificationRouter(subscriptionRepo?: ISubscriptionRepository): Router {
  const repo = subscriptionRepo || new SQLiteSubscriptionRepository(getDatabase());
  const controller = new NotificationController(repo);

  const router = Router();
  router.post('/subscribe', (req, res) => controller.subscribe(req, res));
  router.post('/unsubscribe', (req, res) => controller.unsubscribe(req, res));
  router.get('/settings', (req, res) => controller.getSettings(req, res));
  router.put('/settings', (req, res) => controller.updateSettings(req, res));
  router.get('/vapid-public-key', (req, res) => controller.getVapidPublicKey(req, res));
  return router;
}
