import { Button } from "@/components/ui/button";
import { CollegeCard } from "@/components/CollegeCard";
import type { College } from "@/types";
import { ArrowRight, ListChecks, Plus, School } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { AddCollegeModal } from "@/components/AddCollegeModal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function Dashboard() {
    const [filter, setFilter] = useState<string>("all");
    const [sort, setSort] = useState<string>("deadline");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollege, setEditingCollege] = useState<College | null>(null);

    const [loading, setLoading] = useState(true);
    const [colleges, setColleges] = useState<College[]>([]);

    const navigate = useNavigate();

    // Inside Dashboard component:
    const { user } = useAuth();
    const { tasks } = useTasks(user?.id);

    const upcomingTasks = tasks
        .filter((task) => task.status !== "completed")
        .sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return (
                new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
        })
        .slice(0, 3);
    
    // Simulate fetching data from Supabase
    const fetchColleges = async () => {
        try {
            setLoading(true);
            // Fetch college details
            const { data: collegeData, error: collegeError } =
                await supabase.from("college_applications").select("*");

            if (collegeError) throw collegeError;
            setColleges(collegeData);
        } catch (error) {
            toast.error("Failed to load college data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    const handleSaveCollege = () => {
        fetchColleges();
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

    // Filter and sort logic
    const filteredColleges = colleges
        .filter((college) => filter === "all" || college.status === filter)
        .sort((a, b) => {
            if (sort === "deadline") {
                return (
                    new Date(a.deadline).getTime() -
                    new Date(b.deadline).getTime()
                );
            }
            return a.name.localeCompare(b.name);
        });

    return (
        <div className="container p-6 ml-auto mr-auto">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 pt-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <School className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                        Application Dashboard
                    </h1>
                </div>

                {upcomingTasks.length > 0 ? (
                    <Card className="hover:shadow-sm transition-shadow mt-4">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ListChecks className="h-5 w-5 text-primary" />
                                    Upcoming Tasks
                                </CardTitle>
                                <Link
                                    to="/tasks"
                                    className="text-sm text-primary hover:underline flex items-center"
                                >
                                    View All{" "}
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {upcomingTasks.slice(0, 2).map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={() => {}}
                                        onDelete={() => {}}
                                        onStatusChange={() => {}}
                                        showActions={false}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <></>
                )}

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold tracking-tight">
                            My Applications
                        </h1>
                    </div>

                    <div className="flex sm:flex-row gap-3 w-full sm:w-auto">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Applications
                                </SelectItem>
                                <SelectItem value="not started">
                                    Not Started
                                </SelectItem>
                                <SelectItem value="in progress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="submitted">
                                    Submitted
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="deadline">
                                    Deadline
                                </SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Applications Section */}
                <div className="space-y-2">
                    {filteredColleges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredColleges.map((college) => (
                                <CollegeCard
                                    key={college.id}
                                    college={college}
                                    onClick={() =>
                                        navigate(`/college/${college.id}`)
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-background">
                            <CardContent className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center">
                                    <Plus className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h2 className="text-xl font-semibold">
                                    No applications yet
                                </h2>
                                <p className="text-muted-foreground max-w-md">
                                    Track your first college application to get
                                    started on your journey
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add
                                    College
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Floating Action Button for mobile */}
                <div className="fixed bottom-22 right-4">
                    <Button
                        size="icon"
                        className="rounded-full h-14 w-14 shadow-lg"
                        onClick={() => {
                            setEditingCollege(null);
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            <AddCollegeModal
                mode={editingCollege ? "edit" : "create"}
                existingCollege={editingCollege}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCollege}
            />
        </div>
    );
}
