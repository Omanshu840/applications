// src/hooks/useColleges.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { type College } from '@/types';

export const useColleges = (userId?: string) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const fetchColleges = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('college_applications')
        .select('*')
        .eq('user_id', userId)
        .order('deadline', { ascending: true });

      if (error) throw error;
      setColleges(data || []);
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

  const getCollegeById = (id: string) => {
    return colleges.find(college => college.id === id);
  };

  useEffect(() => {
    fetchColleges();
  }, [userId]);

  return {
    colleges,
    loading,
    error,
    refetch: fetchColleges,
    getCollegeById,
  };
};