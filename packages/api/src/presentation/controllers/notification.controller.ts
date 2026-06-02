import { Request, Response } from 'express';
import { ISubscriptionRepository } from '../../domain/repositories/subscription.repository.js';

export class NotificationController {
  constructor(private subscriptionRepo: ISubscriptionRepository) {}

  async subscribe(req: Request, res: Response): Promise<void> {
    try {
      const { endpoint, keys } = req.body;
      if (!endpoint || !keys?.p256dh || !keys?.auth) {
        res.status(400).json({ error: 'Invalid subscription data' });
        return;
      }
      await this.subscriptionRepo.save({ endpoint, keys });
      res.status(201).json({ message: 'Subscribed' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save subscription' });
    }
  }

  async unsubscribe(req: Request, res: Response): Promise<void> {
    try {
      const { endpoint } = req.body;
      if (!endpoint) {
        res.status(400).json({ error: 'Endpoint is required' });
        return;
      }
      await this.subscriptionRepo.remove(endpoint);
      res.json({ message: 'Unsubscribed' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove subscription' });
    }
  }

  async getSettings(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await this.subscriptionRepo.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get settings' });
    }
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const { enabled, hours } = req.body;
      if (typeof enabled !== 'boolean' || !Array.isArray(hours)) {
        res.status(400).json({ error: 'enabled (boolean) and hours (string[]) are required' });
        return;
      }
      await this.subscriptionRepo.updateSettings(enabled, hours);
      res.json({ message: 'Settings updated', enabled, hours });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  getVapidPublicKey(_req: Request, res: Response): void {
    const publicKey = process.env.VAPID_PUBLIC_KEY || '';
    res.json({ publicKey });
  }
}
