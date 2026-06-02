import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function UnlockToast({ message, onClose, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      data-testid="unlock-toast"
    >
      <div className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-xl shadow-xl font-bold flex items-center gap-3 animate-bounce">
        <span className="text-2xl">🏆</span>
        <div>
          <p className="text-xs uppercase tracking-wide">Conquista Desbloqueada!</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
