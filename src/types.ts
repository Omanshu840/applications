// src/types.ts
export type CollegeStatus = 'not started' | 'in progress' | 'submitted' | 'accepted' | 'rejected';

export interface College {
  id?: string; // Optional for new colleges
  name: string;
  status: CollegeStatus;
  deadline: string; // ISO date string
  location: string;
  program: string;
  tags: string[];
}

export interface CollegeRequirements {
  test_scores_required: boolean;
  test_scores_submitted: boolean;
  lor_required: number;
  lor_submitted: number;
  transcripts_required: boolean;
  transcripts_submitted: boolean;
  additional_requirements?: string;
}

export interface CollegeEssay {
  id: string;
  college_id: string;
  prompt: string;
  response_markdown: string;
  uploaded_draft_url: string | null;
  updated_at: string;
}

// Base Task type
export interface Task {
  id: string;
  user_id: string;
  college_id?: string | null;
  college?: {
    id: string;
    name: string;
  };
  title: string;
  description?: string | null;
  deadline?: string | null; // ISO date string
  status: 'not started' | 'in progress' | 'completed';
  created_at: string;
  updated_at: string;
}