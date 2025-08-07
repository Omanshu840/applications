// components/MobileNavBar.tsx
import { School, ListChecks, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils';

const navItems = [
//   {
//     name: 'Dashboard',
//     path: '/dashboard',
//     icon: Home,
//   },
  {
    name: 'Colleges',
    path: '/dashboard',
    icon: School,
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: ListChecks,
  },
//   {
//     name: 'Profile',
//     path: '/profile',
//     icon: User,
//   },
];

export function MobileNavBar() {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-19 px-6 pb-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center relative w-full h-full"
            >
              <div className="flex flex-col items-center">
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-xs mt-1 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active-indicator"
                  className="absolute top-0 w-full h-1 bg-primary rounded-t-sm"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
        
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </nav>
  );
}