// src/components/TaskCard.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { type Task } from "@/types";

interface TaskCardProps {
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (
        status: "not started" | "in progress" | "completed"
    ) => void;
    showActions: boolean;
}

export function TaskCard({
    task,
    onEdit,
    onDelete,
    onStatusChange,
    showActions = true,
}: TaskCardProps) {
    const deadlineText = task.deadline
        ? formatDistanceToNow(new Date(task.deadline), { addSuffix: true })
        : "No deadline";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    {showActions && (
                        <Checkbox
                            checked={task.status === "completed"}
                            onCheckedChange={(checked) =>
                                onStatusChange(
                                    checked ? "completed" : "not started"
                                )
                            }
                            className="mt-1"
                        />
                    )}
                    <div className="flex-1">
                        <h3
                            className={`font-medium ${
                                task.status === "completed"
                                    ? "line-through text-muted-foreground"
                                    : ""
                            }`}
                        >
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                                {deadlineText}
                            </Badge>
                            {task.college && (
                                <Badge variant="secondary" className="text-xs">
                                    {task.college.name}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                {showActions && (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onEdit}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={onDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
