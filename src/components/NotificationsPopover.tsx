import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const placeholderNotifications = [
  { id: '1', title: 'Week 2 unlocked!', description: 'Your next set of tasks is ready.', time: '2h ago', unread: true },
  { id: '2', title: 'AI Mentor insight available', description: 'New recommendations based on your progress.', time: '5h ago', unread: true },
  { id: '3', title: 'Streak milestone', description: "You've maintained a 3-day learning streak!", time: '1d ago', unread: false },
];

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(placeholderNotifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${n.unread ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  <div className={n.unread ? '' : 'ml-5'}>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
