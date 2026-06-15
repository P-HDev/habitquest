import { useState, useEffect } from 'react';
import {
  getVapidPublicKey,
  subscribeToPush,
  urlBase64ToUint8Array,
} from '../services/notifications';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function NotificationBanner() {
  const [permission, setPermission] = useState<PermissionState>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission as PermissionState);
  }, []);

  if (permission === 'granted' || permission === 'unsupported' || permission === 'denied') {
    return null;
  }

  const handleEnable = async () => {
    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result as PermissionState);

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const vapidKey = await getVapidPublicKey();

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey) as unknown as ArrayBuffer,
        });

        await subscribeToPush(subscription);
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-primary-900/50 border border-primary-700 rounded-lg p-4 flex items-center justify-between"
      data-testid="notification-banner"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔔</span>
        <div>
          <p className="font-semibold text-sm">Ativar lembretes</p>
          <p className="text-xs text-gray-400">Receba notificações para completar seus hábitos</p>
        </div>
      </div>
      <button
        onClick={handleEnable}
        disabled={loading}
        className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {loading ? '...' : 'Ativar'}
      </button>
    </div>
  );
}
