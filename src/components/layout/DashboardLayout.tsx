import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationsPopover } from '@/components/NotificationsPopover';
import { MessagesPopover } from '@/components/MessagesPopover';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main content */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              {title && (
                <h1 className="text-xl font-display font-semibold">{title}</h1>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, tasks..."
                  className="pl-9 w-64 bg-muted/50"
                />
              </div>
              
              <ThemeToggle />
              <NotificationsPopover />
              <MessagesPopover />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
