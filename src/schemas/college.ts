import { z } from "zod";

export const collegeSchema = z.object({
  name: z.string().min(1, "College name is required"),
  location: z.string().min(1, "Location is required"),
  program: z.string().min(1, "Program is required"),
  deadline: z.date({}),
  status: z.enum(['not started', 'in progress', 'submitted', 'accepted', 'rejected']),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export type CollegeFormValues = z.infer<typeof collegeSchema>;