import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Play, 
  CheckCircle2,
  BookOpen,
  FileCode,
  Trophy
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

const scheduledTasks = [
  { 
    id: 1, 
    title: 'React Hooks Deep Dive', 
    type: 'lesson', 
    time: '09:00', 
    duration: '60 min',
    date: new Date(),
    completed: false
  },
  { 
    id: 2, 
    title: 'Build Todo App - Part 1', 
    type: 'project', 
    time: '14:00', 
    duration: '90 min',
    date: new Date(),
    completed: false
  },
  { 
    id: 3, 
    title: 'TypeScript Basics Quiz', 
    type: 'quiz', 
    time: '17:00', 
    duration: '30 min',
    date: new Date(),
    completed: false
  },
  { 
    id: 4, 
    title: 'Context API Tutorial', 
    type: 'lesson', 
    time: '10:00', 
    duration: '45 min',
    date: addDays(new Date(), 1),
    completed: false
  },
  { 
    id: 5, 
    title: 'Build Todo App - Part 2', 
    type: 'project', 
    time: '14:00', 
    duration: '120 min',
    date: addDays(new Date(), 1),
    completed: false
  },
  { 
    id: 6, 
    title: 'State Management Overview', 
    type: 'lesson', 
    time: '09:00', 
    duration: '45 min',
    date: addDays(new Date(), 2),
    completed: false
  },
];

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const getTasksForDate = (date: Date) => {
    return scheduledTasks.filter(task => isSameDay(task.date, date));
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return BookOpen;
      case 'project':
        return FileCode;
      case 'quiz':
        return Trophy;
      default:
        return Play;
    }
  };

  return (
    <DashboardLayout title="Schedule">
      <div className="space-y-6">
        {/* Week Navigation */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>
                  {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayTasks = getTasksForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const today = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'p-4 rounded-xl text-center transition-all',
                      isSelected
                        ? 'gradient-primary text-white shadow-glow'
                        : today
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    <p className={cn(
                      'text-xs font-medium',
                      isSelected ? 'text-white/80' : 'text-muted-foreground'
                    )}>
                      {format(day, 'EEE')}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {format(day, 'd')}
                    </p>
                    {dayTasks.length > 0 && (
                      <div className="flex justify-center gap-1 mt-2">
                        {dayTasks.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              isSelected ? 'bg-white/60' : 'bg-primary'
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{format(selectedDate, 'EEEE, MMMM d')}</CardTitle>
                  <CardDescription>
                    {selectedDateTasks.length} tasks scheduled
                  </CardDescription>
                </div>
                <Button className="gradient-primary">
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateTasks.map((task) => {
                    const TaskIcon = getTaskIcon(task.type);
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          'flex gap-4 p-4 rounded-xl border transition-all hover:shadow-md',
                          task.completed
                            ? 'bg-success/5 border-success/20'
                            : 'bg-card border-border hover:border-primary/50'
                        )}
                      >
                        <div className="text-center min-w-[60px]">
                          <p className="text-lg font-bold">{task.time}</p>
                          <p className="text-xs text-muted-foreground">{task.duration}</p>
                        </div>
                        <div className="w-px bg-border" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'p-2 rounded-lg',
                                task.type === 'lesson' && 'bg-primary/10 text-primary',
                                task.type === 'project' && 'bg-chart-2/10 text-chart-2',
                                task.type === 'quiz' && 'bg-chart-3/10 text-chart-3'
                              )}
                            >
                              <TaskIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge variant="outline" className="text-xs capitalize mt-1">
                                {task.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {task.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-success" />
                          ) : (
                            <Button size="sm">
                              <Play className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tasks scheduled</h3>
                  <p className="text-muted-foreground mb-4">
                    Add some learning tasks for this day
                  </p>
                  <Button>Schedule a Task</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Day Summary</CardTitle>
              <CardDescription>Overview for {format(selectedDate, 'MMM d')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span>Lessons</span>
                  </div>
                  <span className="font-bold">
                    {selectedDateTasks.filter(t => t.type === 'lesson').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-chart-2/10 text-chart-2">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <span>Projects</span>
                  </div>
                  <span className="font-bold">
                    {selectedDateTasks.filter(t => t.type === 'project').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-chart-3/10 text-chart-3">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <span>Quizzes</span>
                  </div>
                  <span className="font-bold">
                    {selectedDateTasks.filter(t => t.type === 'quiz').length}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Total Time</span>
                  <span className="font-bold">
                    {selectedDateTasks.reduce((acc, t) => {
                      const mins = parseInt(t.duration);
                      return acc + mins;
                    }, 0)} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-bold">
                    {selectedDateTasks.filter(t => t.completed).length}/{selectedDateTasks.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
