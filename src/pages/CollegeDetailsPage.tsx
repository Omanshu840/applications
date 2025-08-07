import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { College, CollegeRequirements, CollegeEssay } from "@/types";
import { CollegeHeader } from "@/components/CollegeHeader";
import { RequirementsSection } from "@/components/RequirementsSection";
import { EssayCard } from "@/components/EssayCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AddCollegeModal } from "@/components/AddCollegeModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddEssayModal } from "@/components/AddEssayModal";
import { useAuth } from '@/hooks/useAuth';

export default function CollegeDetailsPage() {
  const { id } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [requirements, setRequirements] = useState<CollegeRequirements | null>(null);
  const [essays, setEssays] = useState<CollegeEssay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddEssayModalOpen, setIsAddEssayModalOpen] = useState(false);
  const {user} = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchCollegeData = async () => {
      try {
        setLoading(true);
        
        // Fetch college details
        const { data: collegeData, error: collegeError } = await supabase
          .from('college_applications')
          .select('*')
          .eq('id', id)
          .single();

        if (collegeError) throw collegeError;

        // Fetch requirements
        const { data: requirementsData} = await supabase
          .from('college_applications_requirements')
          .select('*')
          .eq('college_id', id)
          .single();

        // Fetch essays
        const { data: essaysData, error: essaysError } = await supabase
          .from('college_essays')
          .select('*')
          .eq('college_id', id);

        if (essaysError) throw essaysError;

        setCollege(collegeData);
        setRequirements(requirementsData || {});
        setEssays(essaysData || []);
      } catch (error) {
        toast.error('Failed to load college data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [id]);

  const handleSaveCollege = async (updatedCollege: College) => {
    try {
      const { error } = await supabase
        .from('college_applications')
        .update(updatedCollege)
        .eq('id', updatedCollege.id);

      if (error) throw error;

      setCollege(updatedCollege);
      setIsEditModalOpen(false);
      toast.success('College updated successfully');
    } catch (error) {
      toast.error('Failed to update college');
      console.error(error);
    }
  };

  const handleSaveEssay = (updatedEssay: CollegeEssay) => {
    setEssays(essays.map(e => e.id === updatedEssay.id ? updatedEssay : e));
  };

  const handleAddEssay = async (prompt: string) => {
    try {
      const { data, error } = await supabase
        .from('college_essays')
        .insert({
          prompt,
          college_id: id!,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setEssays([...essays, data]);
      setIsAddEssayModalOpen(false);
      toast.success('Essay prompt added successfully');
    } catch (error) {
      toast.error('Failed to add essay prompt');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container p-6 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!college) {
    return <div className="container p-6">College not found</div>;
  }

  return (
    <div className="container p-6 space-y-8">
      <CollegeHeader 
        college={college} 
        onEdit={() => setIsEditModalOpen(true)} 
      />
      
      <RequirementsSection
        collegeId={id!}
        requirements={requirements}
        onUpdate={setRequirements}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Essay Prompts</h2>
          <Button 
            size="sm" 
            onClick={() => setIsAddEssayModalOpen(true)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Prompt
          </Button>
        </div>
        
        {essays.length > 0 ? (
          <div className="space-y-4">
            {essays.map(essay => (
              <EssayCard 
                key={essay.id} 
                essay={essay} 
                onSave={handleSaveEssay} 
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No essay prompts found for this college
            </p>
            <Button 
              variant="outline"
              onClick={() => setIsAddEssayModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Prompt
            </Button>
          </div>
        )}
      </div>

      <AddCollegeModal
        mode="edit"
        existingCollege={college}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCollege}
      />

      <AddEssayModal
        open={isAddEssayModalOpen}
        onClose={() => setIsAddEssayModalOpen(false)}
        onSave={handleAddEssay}
      />
    </div>
  );
}