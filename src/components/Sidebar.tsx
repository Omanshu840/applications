import { NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, ListTodo } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Sidebar() {

    return (
        <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-50 border-r bg-muted text-muted-foreground">
            {/* Navigation Links */}
            <ScrollArea className="flex-1">
                <nav className="flex-1 p-2 space-y-1 pt-5">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-md transition-colors ${
                                isActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "hover:bg-muted-foreground/10"
                            }`
                        }
                    >
                        <GraduationCap className="w-5 h-5 mr-3" />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-md transition-colors ${
                                isActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "hover:bg-muted-foreground/10"
                            }`
                        }
                    >
                        <ListTodo className="w-5 h-5 mr-3" />
                        Tasks
                    </NavLink>

                    {/* Theme Toggle Button */}
                    <div className="mt-4 px-2">
                        <ThemeSwitcher />
                    </div>
                </nav>
            </ScrollArea>
        </div>
    );
}
