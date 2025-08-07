import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import * as webPush from 'https://esm.sh/web-push@3.5.0';

const vapidKeys = {
  publicKey: Deno.env.get('VAPID_PUBLIC_KEY')!,
  privateKey: Deno.env.get('VAPID_PRIVATE_KEY')!
};

webPush.setVapidDetails(
  'mailto:contact@collegetrackr.app',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405
    });
  }

  try {
    const { userId, title, body, url } = await req.json();

    // Get user's subscription from Supabase
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('subscription')
      .eq('user_id', userId)
      .single();

    if (error || !subscription) {
      return new Response(JSON.stringify({ error: 'User not subscribed' }), {
        status: 400
      });
    }

    // Send notification
    await webPush.sendNotification(
      subscription.subscription,
      JSON.stringify({
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        vibrate: [200, 100, 200],
        data: { url }
      })
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    };
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
});