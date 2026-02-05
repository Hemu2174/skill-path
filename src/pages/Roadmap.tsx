import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeTasks } from '@/hooks/useRealtimeTasks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle2, 
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

interface RoadmapWeek {
  id: string;
  week_number: number;
  title: string;
  description: string | null;
  is_current: boolean | null;
  roadmap_id: string;
}

interface Roadmap {
  id: string;
  title: string;
  description: string | null;
  duration_weeks: number;
  status: string | null;
}

export default function Roadmap() {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading, updateTask } = useRealtimeTasks(user?.id);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [weeks, setWeeks] = useState<RoadmapWeek[]>([]);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmapData() {
      if (!user) return;

      // Fetch roadmap (get the most recent active one)
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (roadmapError) {
        console.error('Error fetching roadmap:', roadmapError);
        setLoading(false);
        return;
      }

      if (roadmapData) {
        setRoadmap(roadmapData);

        // Fetch weeks
        const { data: weeksData, error: weeksError } = await supabase
          .from('roadmap_weeks')
          .select('*')
          .eq('roadmap_id', roadmapData.id)
          .order('week_number', { ascending: true });

        if (weeksError) {
          console.error('Error fetching weeks:', weeksError);
        } else if (weeksData) {
          setWeeks(weeksData);
          // Expand current week by default
          const currentWeek = weeksData.find(w => w.is_current);
          if (currentWeek) {
            setExpandedWeeks([currentWeek.id]);
          } else if (weeksData.length > 0) {
            setExpandedWeeks([weeksData[0].id]);
          }
        }
      }

      setLoading(false);
    }

    fetchRoadmapData();
  }, [user]);

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekId)
        ? prev.filter((id) => id !== weekId)
        : [...prev, weekId]
    );
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await updateTask(taskId, { 
        is_completed: !currentStatus,
        completed_at: !currentStatus ? new Date().toISOString() : null
      });
      toast.success(!currentStatus ? 'Task completed! 🎉' : 'Task marked incomplete');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const getWeekTasks = (weekId: string) => {
    return tasks.filter(task => task.week_id === weekId);
  };

  const getWeekProgress = (weekId: string) => {
    const weekTasks = getWeekTasks(weekId);
    if (weekTasks.length === 0) return 0;
    const completed = weekTasks.filter(t => t.is_completed).length;
    return (completed / weekTasks.length) * 100;
  };

  const getWeekStatus = (week: RoadmapWeek, weekIndex: number) => {
    const weekTasks = getWeekTasks(week.id);
    const allCompleted = weekTasks.length > 0 && weekTasks.every(t => t.is_completed);
    
    if (allCompleted) return 'completed';
    if (week.is_current) return 'current';
    
    // Check if previous weeks are completed
    const previousWeeks = weeks.slice(0, weekIndex);
    const previousCompleted = previousWeeks.every(prevWeek => {
      const prevTasks = getWeekTasks(prevWeek.id);
      return prevTasks.length === 0 || prevTasks.every(t => t.is_completed);
    });
    
    if (previousCompleted || weekIndex === 0) return 'upcoming';
    return 'locked';
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

  const overallProgress = tasks.length > 0
    ? {
        completed: tasks.filter(t => t.is_completed).length,
        total: tasks.length,
      }
    : { completed: 0, total: 0 };

  const currentWeekNumber = weeks.find(w => w.is_current)?.week_number || 1;

  if (loading || tasksLoading) {
    return (
      <DashboardLayout title="Learning Roadmap">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!roadmap || weeks.length === 0) {
    return (
      <DashboardLayout title="Learning Roadmap">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-display font-bold mb-2">No Roadmap Yet</h2>
            <p className="text-muted-foreground mb-4">
              Complete your onboarding to generate a personalized learning roadmap.
            </p>
            <Button asChild className="gradient-primary">
              <a href="/onboarding">Start Onboarding</a>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

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
                  {overallProgress.total > 0 
                    ? Math.round((overallProgress.completed / overallProgress.total) * 100)
                    : 0}%
                </p>
                <p className="text-white/80 text-sm">Overall Progress</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Week {currentWeekNumber} of {roadmap.duration_weeks}</span>
                <span>{overallProgress.completed}/{overallProgress.total} tasks completed</span>
              </div>
              <Progress 
                value={overallProgress.total > 0 ? (overallProgress.completed / overallProgress.total) * 100 : 0} 
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
                {overallProgress.completed === 0 
                  ? "Get started by completing your first task. Every journey begins with a single step!"
                  : overallProgress.completed === overallProgress.total
                  ? "Congratulations! You've completed all tasks. Consider moving to your capstone project!"
                  : `Great progress! You've completed ${overallProgress.completed} tasks. Keep the momentum going!`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Timeline */}
        <div className="space-y-4">
          {weeks.map((week, index) => {
            const isExpanded = expandedWeeks.includes(week.id);
            const progress = getWeekProgress(week.id);
            const status = getWeekStatus(week, index);
            const isLocked = status === 'locked';
            const weekTasks = getWeekTasks(week.id);

            return (
              <Card
                key={week.id}
                className={cn(
                  'transition-all duration-200',
                  isLocked && 'opacity-60',
                  status === 'current' && 'ring-2 ring-primary shadow-glow'
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
                        status === 'completed'
                          ? 'bg-success text-success-foreground'
                          : status === 'current'
                          ? 'gradient-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        week.week_number
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{week.title}</CardTitle>
                        <Badge
                          variant={
                            status === 'completed' || status === 'current'
                              ? 'default'
                              : 'secondary'
                          }
                          className={cn(
                            status === 'completed' && 'bg-success',
                            status === 'current' && 'gradient-primary'
                          )}
                        >
                          {status === 'completed'
                            ? 'Completed'
                            : status === 'current'
                            ? 'In Progress'
                            : status === 'upcoming'
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
                          {weekTasks.filter(t => t.is_completed).length}/{weekTasks.length} tasks
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
                      {weekTasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No tasks for this week yet.
                        </p>
                      ) : (
                        weekTasks.map((task) => {
                          const TaskIcon = getTaskIcon(task.task_type);
                          return (
                            <div
                              key={task.id}
                              className={cn(
                                'flex items-center gap-4 p-4 rounded-lg border transition-all',
                                task.is_completed
                                  ? 'bg-success/5 border-success/20'
                                  : 'bg-muted/30 border-border hover:border-primary/50'
                              )}
                            >
                              <Checkbox
                                checked={task.is_completed || false}
                                onCheckedChange={() => handleToggleTask(task.id, task.is_completed || false)}
                                className="w-5 h-5"
                              />
                              <div
                                className={cn(
                                  'p-2 rounded-lg',
                                  task.task_type === 'lesson' && 'bg-primary/10 text-primary',
                                  task.task_type === 'project' && 'bg-chart-2/10 text-chart-2',
                                  task.task_type === 'quiz' && 'bg-chart-3/10 text-chart-3'
                                )}
                              >
                                <TaskIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p
                                  className={cn(
                                    'font-medium',
                                    task.is_completed && 'line-through text-muted-foreground'
                                  )}
                                >
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {task.task_type}
                                  </Badge>
                                  {task.duration_minutes && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {task.duration_minutes} min
                                    </span>
                                  )}
                                </div>
                              </div>
                              {!task.is_completed && (
                                <Button size="sm" variant="ghost">
                                  <Play className="w-4 h-4 mr-1" />
                                  Start
                                </Button>
                              )}
                            </div>
                          );
                        })
                      )}
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
