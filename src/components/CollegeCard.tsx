import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { College } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";

interface CollegeCardProps {
  college: College;
  onClick: () => void;
}

const statusIcons = {
  'not started': <PlayCircle className="h-4 w-4" />,
  'in progress': <Clock className="h-4 w-4" />,
  'submitted': <CheckCircle2 className="h-4 w-4" />,
  'accepted': <CheckCircle2 className="h-4 w-4" />,
  'rejected': <CheckCircle2 className="h-4 w-4" />,
};

const statusColors = {
  'not started': 'bg-gray-100 text-gray-800',
  'in progress': 'bg-blue-100 text-blue-800',
  'submitted': 'bg-purple-100 text-purple-800',
  'accepted': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
};

export function CollegeCard({ college, onClick }: CollegeCardProps) {
  const deadlineDate = new Date(college.deadline);
  const daysUntilDeadline = formatDistanceToNow(deadlineDate, { addSuffix: true });

  return (
    <Card className={`transition-all hover:shadow-md ${college.status === 'submitted' ? 'border-l-4 border-l-purple-500' : ''}`} onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{college.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{college.location}</span>
          <span>•</span>
          <span>{college.program}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Badge className={`${statusColors[college.status]} flex items-center gap-1`}>
            {statusIcons[college.status]}
            {college.status}
          </Badge>
          <Badge variant="outline" className="font-medium">
            Due {daysUntilDeadline}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-0">
        {college.tags.map(tag => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}