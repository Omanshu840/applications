import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { supabase } from '../_shared/supabase.ts';

serve(async (_req) => {
  // Get tasks due in next 24 hours
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data: tasks, error: tasksError } = await supabase
    .from('application_tasks')
    .select('id, title, deadline, user_id')
    .lt('deadline', tomorrow.toISOString())
    .gt('deadline', now.toISOString())
    .neq('status', 'completed');

  if (tasksError) {
    return new Response(JSON.stringify({ error: tasksError.message }), {
      status: 500
    };
  }

  // Get college deadlines due in next 24 hours
  const { data: colleges, error: collegesError } = await supabase
    .from('college_applications')
    .select('id, name, deadline, user_id')
    .lt('deadline', tomorrow.toISOString())
    .gt('deadline', now.toISOString())
    .neq('status', 'submitted');

  if (collegesError) {
    return new Response(JSON.stringify({ error: collegesError.message }), {
      status: 500
    };
  }

  // Send notifications
  const notifications = [
    ...tasks.map(task => ({
      userId: task.user_id,
      title: 'Task due soon',
      body: `${task.title} is due soon`,
      url: `/tasks`
    })),
    ...colleges.map(college => ({
      userId: college.user_id,
      title: 'Application deadline approaching',
      body: `${college.name} application is due soon`,
      url: `/college/${college.id}`
    }))
  ];

  // Trigger notifications via edge function
  const results = await Promise.allSettled(
    notifications.map(notification =>
      fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify(notification)
      })
    )
  );

  return new Response(JSON.stringify({ 
    tasks: tasks.length,
    colleges: colleges.length,
    notifications: results.length
  }), {
    status: 200
  });
});