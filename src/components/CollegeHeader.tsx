// src/components/CollegeHeader.tsx
import { type College } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface CollegeHeaderProps {
  college: College;
  onEdit: () => void;
}

export function CollegeHeader({ college, onEdit }: CollegeHeaderProps) {
  const deadlineDate = new Date(college.deadline);
  const daysUntilDeadline = formatDistanceToNow(deadlineDate, { addSuffix: true });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{college.name}</h1>
          <p className="text-muted-foreground">{college.location}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{college.program}</Badge>
        <Badge variant="outline" className="font-medium">
          Due {daysUntilDeadline}
        </Badge>
        {college.tags.map(tag => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}