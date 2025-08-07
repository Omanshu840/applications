import { useEffect } from 'react';
import { NotificationService } from '@/services/NotificationService';

export const usePWA = (userId?: string) => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration);
          })
          .catch(error => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }, []);

  const enableNotifications = async () => {
    if (!userId) return false;
    return NotificationService.registerPushNotifications(userId);
  };

  return { enableNotifications };
};