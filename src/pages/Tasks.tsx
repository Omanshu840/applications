// src/pages/tasks.tsx
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useColleges } from "@/hooks/useColleges";
import { AddTaskModal } from "@/components/AddTaskModal";
import { TaskCard } from "@/components/TaskCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import type { TaskFormValues } from "@/schemas/task";
import type { Task } from "@/types";

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(user?.id);
  const { colleges } = useColleges(user?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const upcomingTasks = tasks.filter(
    task => task.status !== 'completed' && 
      (!task.deadline || new Date(task.deadline) > new Date())
  );

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const overdueTasks = tasks.filter(
    task => task.status !== 'completed' && 
      task.deadline && 
      new Date(task.deadline) < new Date()
  );

  const handleAddTask = async (values: TaskFormValues) => {
    if (!user?.id) return;
    await addTask({ 
      ...values, 
      user_id: user.id,
      deadline: values.deadline ? values.deadline.toISOString() : undefined
    });
  };

  const handleUpdateTask = async (values: TaskFormValues) => {
    if (!editingTask?.id) return;
    await updateTask(editingTask.id, {
      ...values,
      deadline: values.deadline ? values.deadline.toISOString() : undefined,
    });
    setEditingTask(null);
  };

  const handleStatusChange = async (taskId: string, status: 'not started' | 'in progress' | 'completed') => {
    await updateTask(taskId, { status });
  };

  return (
    <div className="container p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Application Tasks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : upcomingTasks.length > 0 ? (
            upcomingTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
                onDelete={() => deleteTask(task.id)}
                onStatusChange={(status) => handleStatusChange(task.id, status)}
                showActions={true}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming tasks
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : overdueTasks.length > 0 ? (
            overdueTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
                onDelete={() => deleteTask(task.id)}
                onStatusChange={(status) => handleStatusChange(task.id, status)}
                showActions={true}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No overdue tasks
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : completedTasks.length > 0 ? (
            completedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
                onDelete={() => deleteTask(task.id)}
                onStatusChange={(status) => handleStatusChange(task.id, status)}
                showActions={true}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No completed tasks
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddTaskModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        colleges={colleges}
        initialData={editingTask ? {
          title: editingTask.title,
          status: editingTask.status,
          description: editingTask.description ?? undefined,
          deadline: editingTask.deadline ? new Date(editingTask.deadline) : undefined,
          college_id: editingTask.college_id ?? undefined
        } : undefined}
      />
    </div>
  );
}