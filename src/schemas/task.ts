// src/schemas.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deadline: z.date().optional(),
  status: z.enum(['not started', 'in progress', 'completed']),
  college_id: z.string().optional(),
});

// Infer the TypeScript type from Zod schema
export type TaskFormValues = z.infer<typeof taskSchema>;