import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const placeholderMessages = [
  { id: '1', sender: 'AI Mentor', text: 'Great job completing your first week! Ready for a challenge?', time: '1h ago', unread: true },
  { id: '2', sender: 'System', text: 'Your weekly report is ready to view.', time: '3h ago', unread: false },
];

export function MessagesPopover() {
  const [messages] = useState(placeholderMessages);
  const [reply, setReply] = useState('');

  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-chart-2 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold text-sm">Messages</h4>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No messages</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${m.unread ? 'bg-chart-2/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{m.sender[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{m.sender}</p>
                      <span className="text-xs text-muted-foreground">{m.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t border-border flex gap-2">
          <Input
            placeholder="Type a message..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="text-sm h-8"
          />
          <Button size="icon" className="h-8 w-8 flex-shrink-0" disabled={!reply.trim()}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
