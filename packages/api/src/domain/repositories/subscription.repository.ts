export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface ISubscriptionRepository {
  save(subscription: PushSubscriptionData): Promise<void>;
  remove(endpoint: string): Promise<void>;
  findAll(): Promise<PushSubscriptionData[]>;
  getSettings(): Promise<{ enabled: boolean; hours: string[] }>;
  updateSettings(enabled: boolean, hours: string[]): Promise<void>;
}
