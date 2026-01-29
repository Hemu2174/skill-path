import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Play, 
  BookOpen, 
  FileCode, 
  Trophy,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock roadmap data (in production, this would come from API)
const mockRoadmap = {
  title: 'Frontend Developer Learning Path',
  description: 'Master modern frontend development with React, TypeScript, and more',
  totalWeeks: 6,
  currentWeek: 2,
  weeks: [
    {
      id: 'week-1',
      weekNumber: 1,
      title: 'Foundations & Setup',
      description: 'Get started with HTML, CSS, and JavaScript basics',
      status: 'completed',
      tasks: [
        { id: 't1', title: 'HTML5 Fundamentals', type: 'lesson', duration: 45, completed: true },
        { id: 't2', title: 'CSS3 & Flexbox', type: 'lesson', duration: 60, completed: true },
        { id: 't3', title: 'JavaScript Basics Quiz', type: 'quiz', duration: 20, completed: true },
        { id: 't4', title: 'Build a Landing Page', type: 'project', duration: 120, completed: true },
      ],
    },
    {
      id: 'week-2',
      weekNumber: 2,
      title: 'React Fundamentals',
      description: 'Learn React core concepts and component-based architecture',
      status: 'current',
      tasks: [
        { id: 't5', title: 'React Components & JSX', type: 'lesson', duration: 60, completed: true },
        { id: 't6', title: 'State & Props', type: 'lesson', duration: 45, completed: true },
        { id: 't7', title: 'React Hooks Deep Dive', type: 'lesson', duration: 60, completed: false },
        { id: 't8', title: 'Build a Todo App', type: 'project', duration: 180, completed: false },
      ],
    },
    {
      id: 'week-3',
      weekNumber: 3,
      title: 'Advanced React',
      description: 'Master advanced patterns and state management',
      status: 'upcoming',
      tasks: [
        { id: 't9', title: 'Context API', type: 'lesson', duration: 45, completed: false },
        { id: 't10', title: 'React Query', type: 'lesson', duration: 60, completed: false },
        { id: 't11', title: 'Performance Optimization', type: 'lesson', duration: 45, completed: false },
        { id: 't12', title: 'Build a Dashboard', type: 'project', duration: 240, completed: false },
      ],
    },
    {
      id: 'week-4',
      weekNumber: 4,
      title: 'TypeScript Integration',
      description: 'Add type safety to your React applications',
      status: 'locked',
      tasks: [
        { id: 't13', title: 'TypeScript Basics', type: 'lesson', duration: 60, completed: false },
        { id: 't14', title: 'TypeScript with React', type: 'lesson', duration: 60, completed: false },
        { id: 't15', title: 'TypeScript Quiz', type: 'quiz', duration: 25, completed: false },
        { id: 't16', title: 'Migrate Project to TS', type: 'project', duration: 180, completed: false },
      ],
    },
    {
      id: 'week-5',
      weekNumber: 5,
      title: 'Testing & Quality',
      description: 'Write tests and ensure code quality',
      status: 'locked',
      tasks: [
        { id: 't17', title: 'Unit Testing with Vitest', type: 'lesson', duration: 60, completed: false },
        { id: 't18', title: 'Component Testing', type: 'lesson', duration: 45, completed: false },
        { id: 't19', title: 'E2E with Playwright', type: 'lesson', duration: 60, completed: false },
        { id: 't20', title: 'Add Tests to Project', type: 'project', duration: 180, completed: false },
      ],
    },
    {
      id: 'week-6',
      weekNumber: 6,
      title: 'Capstone Project',
      description: 'Build a full-stack application',
      status: 'locked',
      tasks: [
        { id: 't21', title: 'Project Planning', type: 'lesson', duration: 45, completed: false },
        { id: 't22', title: 'Build Capstone App', type: 'project', duration: 480, completed: false },
        { id: 't23', title: 'Code Review', type: 'quiz', duration: 60, completed: false },
        { id: 't24', title: 'Final Presentation', type: 'project', duration: 60, completed: false },
      ],
    },
  ],
};

export default function Roadmap() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(mockRoadmap);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>(['week-2']);

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekId)
        ? prev.filter((id) => id !== weekId)
        : [...prev, weekId]
    );
  };

  const toggleTask = (weekId: string, taskId: string) => {
    setRoadmap((prev) => ({
      ...prev,
      weeks: prev.weeks.map((week) =>
        week.id === weekId
          ? {
              ...week,
              tasks: week.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : week
      ),
    }));
    toast.success('Progress updated!');
  };

  const getWeekProgress = (week: typeof mockRoadmap.weeks[0]) => {
    const completed = week.tasks.filter((t) => t.completed).length;
    return (completed / week.tasks.length) * 100;
  };

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

  const overallProgress = roadmap.weeks.reduce(
    (acc, week) => {
      const completed = week.tasks.filter((t) => t.completed).length;
      return {
        completed: acc.completed + completed,
        total: acc.total + week.tasks.length,
      };
    },
    { completed: 0, total: 0 }
  );

  return (
    <DashboardLayout title="Learning Roadmap">
      <div className="space-y-6">
        {/* Header */}
        <Card className="overflow-hidden">
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">{roadmap.title}</h2>
                <p className="text-white/80">{roadmap.description}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {Math.round((overallProgress.completed / overallProgress.total) * 100)}%
                </p>
                <p className="text-white/80 text-sm">Overall Progress</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Week {roadmap.currentWeek} of {roadmap.totalWeeks}</span>
                <span>{overallProgress.completed}/{overallProgress.total} tasks completed</span>
              </div>
              <Progress 
                value={(overallProgress.completed / overallProgress.total) * 100} 
                className="h-2 bg-white/20"
              />
            </div>
          </div>
        </Card>

        {/* AI Recommendation */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">AI Recommendation</h3>
              <p className="text-sm text-muted-foreground">
                Based on your progress, focus on completing "React Hooks Deep Dive" today. 
                You're ahead of schedule and maintaining great consistency!
              </p>
            </div>
            <Button size="sm" className="gradient-primary">
              Start Now
            </Button>
          </CardContent>
        </Card>

        {/* Roadmap Timeline */}
        <div className="space-y-4">
          {roadmap.weeks.map((week, index) => {
            const isExpanded = expandedWeeks.includes(week.id);
            const progress = getWeekProgress(week);
            const isLocked = week.status === 'locked';

            return (
              <Card
                key={week.id}
                className={cn(
                  'transition-all duration-200',
                  isLocked && 'opacity-60',
                  week.status === 'current' && 'ring-2 ring-primary shadow-glow'
                )}
              >
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => !isLocked && toggleWeek(week.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Week indicator */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
                        week.status === 'completed'
                          ? 'bg-success text-success-foreground'
                          : week.status === 'current'
                          ? 'gradient-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {week.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        week.weekNumber
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{week.title}</CardTitle>
                        <Badge
                          variant={
                            week.status === 'completed'
                              ? 'default'
                              : week.status === 'current'
                              ? 'default'
                              : 'secondary'
                          }
                          className={cn(
                            week.status === 'completed' && 'bg-success',
                            week.status === 'current' && 'gradient-primary'
                          )}
                        >
                          {week.status === 'completed'
                            ? 'Completed'
                            : week.status === 'current'
                            ? 'In Progress'
                            : week.status === 'upcoming'
                            ? 'Up Next'
                            : 'Locked'}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {week.description}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{Math.round(progress)}%</p>
                        <p className="text-xs text-muted-foreground">
                          {week.tasks.filter((t) => t.completed).length}/{week.tasks.length} tasks
                        </p>
                      </div>
                      {!isLocked && (
                        isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <Progress value={progress} className="mt-4 h-2" />
                </CardHeader>

                {/* Tasks */}
                {isExpanded && !isLocked && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {week.tasks.map((task) => {
                        const TaskIcon = getTaskIcon(task.type);
                        return (
                          <div
                            key={task.id}
                            className={cn(
                              'flex items-center gap-4 p-4 rounded-lg border transition-all',
                              task.completed
                                ? 'bg-success/5 border-success/20'
                                : 'bg-muted/30 border-border hover:border-primary/50'
                            )}
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(week.id, task.id)}
                              className="w-5 h-5"
                            />
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
                            <div className="flex-1">
                              <p
                                className={cn(
                                  'font-medium',
                                  task.completed && 'line-through text-muted-foreground'
                                )}
                              >
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {task.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {task.duration} min
                                </span>
                              </div>
                            </div>
                            {!task.completed && (
                              <Button size="sm" variant="ghost">
                                <Play className="w-4 h-4 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
