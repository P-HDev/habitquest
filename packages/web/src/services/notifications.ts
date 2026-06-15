import { API_BASE } from './config';

export async function getVapidPublicKey(): Promise<string> {
  const res = await fetch(`${API_BASE}/notifications/vapid-public-key`);
  if (!res.ok) throw new Error('Failed to get VAPID key');
  const data = await res.json();
  return data.publicKey;
}

export async function subscribeToPush(subscription: PushSubscription): Promise<void> {
  const res = await fetch(`${API_BASE}/notifications/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription.toJSON()),
  });
  if (!res.ok) throw new Error('Failed to subscribe');
}

export async function unsubscribeFromPush(endpoint: string): Promise<void> {
  const res = await fetch(`${API_BASE}/notifications/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint }),
  });
  if (!res.ok) throw new Error('Failed to unsubscribe');
}

export async function getNotificationSettings(): Promise<{ enabled: boolean; hours: string[] }> {
  const res = await fetch(`${API_BASE}/notifications/settings`);
  if (!res.ok) throw new Error('Failed to get settings');
  return res.json();
}

export async function updateNotificationSettings(enabled: boolean, hours: string[]): Promise<void> {
  const res = await fetch(`${API_BASE}/notifications/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled, hours }),
  });
  if (!res.ok) throw new Error('Failed to update settings');
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
