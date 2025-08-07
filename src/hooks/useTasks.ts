// src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {type Task } from '@/types';

export const useTasks = (userId: string|undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('application_tasks')
        .select(`
          *,
          college:college_id (name, id)
        `)
        .eq('user_id', userId)
        .order('deadline', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message: string }).message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id'|'created_at'|'updated_at'>) => {
    const { data, error } = await supabase
      .from('application_tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    setTasks(prev => [...prev, data]);
    return data;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('application_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setTasks(prev => prev.map(t => t.id === id ? data : t));
    return data
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('application_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};