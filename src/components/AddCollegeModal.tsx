import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { collegeSchema, type CollegeFormValues } from "@/schemas/college";
import type { College } from "@/types";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

const TAG_OPTIONS = ['MBA', 'MS CS', 'MS DS', 'PhD', 'Dream', 'Target', 'Safety'];

interface AddCollegeModalProps {
  mode: 'create' | 'edit';
  existingCollege: College|null;
  open: boolean;
  onClose: () => void;
  onSave: (college: College) => void;
}

export function AddCollegeModal({
  mode,
  existingCollege,
  open,
  onClose,
  onSave,
}: AddCollegeModalProps) {
  const defaultValues: Partial<CollegeFormValues> = {
    name: existingCollege?.name || '',
    location: existingCollege?.location || '',
    program: existingCollege?.program || '',
    deadline: existingCollege?.deadline ? new Date(existingCollege.deadline) : new Date(),
    status: existingCollege?.status || 'not started',
    tags: existingCollege?.tags || [],
  };

  const form = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeSchema),
    defaultValues,
  });

  const { watch } = form;
  const selectedTags = watch('tags');

  const toggleTag = (tag: string) => {
    const currentTags = form.getValues('tags');
    if (currentTags.includes(tag)) {
      form.setValue('tags', currentTags.filter(t => t !== tag));
    } else {
      form.setValue('tags', [...currentTags, tag]);
    }
  };

  const {user} = useAuth();

  const onSubmit = async (values: CollegeFormValues) => {
    try {
      const collegeData = {
        ...values,
        deadline: values.deadline.toISOString(),
        user_id: user?.id
      };

      if (mode === 'edit' && existingCollege?.id) {
        // Update existing college
        const { error } = await supabase
          .from('college_applications')
          .update(collegeData)
          .eq('id', existingCollege.id);

        if (error) throw error;
        toast.success('College updated successfully');
      } else {
        // Create new college
        const { error } = await supabase
          .from('college_applications')
          .insert(collegeData)
          .select()
          .single();

        if (error) throw error;
        toast.success('College added successfully');
      }

      onSave({
        ...collegeData,
        id: mode === 'edit' ? existingCollege?.id : crypto.randomUUID(), // Mock ID for demo
      });
      onClose();
    } catch (error) {
      toast.error('Failed to save college');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] sm:max-w-[625px]">
        <ScrollArea className="max-h-[80vh] pr-4">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Add New College' : 'Edit College'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Stanford University" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Stanford, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <FormControl>
                        <Input placeholder="MS Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="not started">Not Started</SelectItem>
                          <SelectItem value="in progress">In Progress</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  {mode === 'create' ? 'Add College' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}