import { supabase } from '@/lib/supabase';

export class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async registerPushNotifications(userId: string) {
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker not supported');
      return;
    }

    if (!await this.requestPermission()) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
      });

      // Save subscription to Supabase
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          subscription: subscription.toJSON()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error registering push notifications:', error);
      return false;
    }
  }

  static async showLocalNotification(title: string, options?: NotificationOptions) {
    if (!await this.requestPermission()) return;

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  }
}