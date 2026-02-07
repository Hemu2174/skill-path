import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle2, 
  Play, 
  Calendar,
  Flame,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useProgressData } from '@/hooks/useProgressData';

export default function Dashboard() {
  const { user } = useAuth();
  const { taskCompletionData, stats, loading: progressLoading } = useProgressData();
  const [userGoal, setUserGoal] = useState<any>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [taskTypeBreakdown, setTaskTypeBreakdown] = useState<any[]>([]);
  const [activityDays, setActivityDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [goalsRes, tasksRes] = await Promise.all([
        supabase.from('user_goals').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('tasks').select('*, roadmap_weeks!inner(week_number)').eq('user_id', user.id),
      ]);

      setUserGoal(goalsRes.data);

      const tasks = tasksRes.data || [];

      // Upcoming (incomplete) tasks - first 3
      const incomplete = tasks
        .filter(t => !t.is_completed)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        .slice(0, 3);
      setUpcomingTasks(incomplete);

      // Task type breakdown
      const typeCount: Record<string, number> = {};
      tasks.forEach(t => {
        const type = t.task_type || 'lesson';
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      const total = tasks.length || 1;
      const colors = ['hsl(262, 83%, 58%)', 'hsl(280, 75%, 55%)', 'hsl(240, 60%, 60%)'];
      const typeLabels: Record<string, string> = { lesson: 'Lessons', quiz: 'Quizzes', project: 'Projects' };
      setTaskTypeBreakdown(
        Object.entries(typeCount).map(([name, value], i) => ({
          name: typeLabels[name] || name,
          value: Math.round((value / total) * 100),
          color: colors[i % colors.length],
        }))
      );

      // Activity days - days this month with completed tasks
      const now = new Date();
      const completedThisMonth = tasks
        .filter(t => t.completed_at && new Date(t.completed_at).getMonth() === now.getMonth())
        .map(t => new Date(t.completed_at!).getDate());
      setActivityDays([...new Set(completedThisMonth)]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completionPct = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  // Build calendar grid for current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const calendarWeeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { calendarWeeks.push(week); week = []; }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); calendarWeeks.push(week); }

  // Performance chart data from taskCompletionData
  const performanceData = taskCompletionData.map(d => ({
    week: d.date,
    theory: d.total,
    practice: d.completed,
  }));

  const statCards = [
    { 
      label: 'Learning Hours', 
      value: `${stats.hoursSpent}`,
      change: 'Total time invested',
      icon: Clock,
      color: 'text-chart-1'
    },
    { 
      label: 'Progress Score', 
      value: `${completionPct}%`,
      change: `${stats.completedTasks} of ${stats.totalTasks} tasks`,
      icon: TrendingUp,
      color: 'text-chart-2'
    },
    { 
      label: 'Tasks Completed', 
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      change: `${completionPct}% complete`,
      icon: Target,
      color: 'text-chart-3'
    },
    { 
      label: 'Current Streak', 
      value: `${stats.currentStreak} days`,
      change: stats.currentStreak > 0 ? 'Keep it up!' : 'Start today!',
      icon: Flame,
      color: 'text-warning'
    },
  ];

  if (loading || progressLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Learner'}! 👋
            </h2>
            <p className="text-muted-foreground mt-1">
              {completionPct >= 100 
                ? "You've completed your roadmap! Check out next-level paths."
                : "You're making great progress. Keep up the momentum!"}
            </p>
          </div>
          <Button asChild className="gradient-primary">
            <Link to="/roadmap">
              View Roadmap
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="stat-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Task Progress by Week</CardTitle>
                <CardDescription>Total vs Completed tasks</CardDescription>
              </div>
              <Badge variant="secondary">Real-time</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {performanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="theoryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="practiceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(280, 75%, 55%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(280, 75%, 55%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="theory" 
                        stroke="hsl(262, 83%, 58%)" 
                        strokeWidth={2}
                        fill="url(#theoryGradient)"
                        name="Total"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="practice" 
                        stroke="hsl(280, 75%, 55%)" 
                        strokeWidth={2}
                        fill="url(#practiceGradient)"
                        name="Completed"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Complete onboarding to see your progress chart
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-2" />
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Activity Calendar */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Learning Activity</CardTitle>
                <Badge variant="secondary">This month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
                {calendarWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                          day === null
                            ? ''
                            : activityDays.includes(day)
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary/20" />
                  <span>{activityDays.length} Active days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Statistics */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Task Statistics</CardTitle>
                <Badge variant="secondary">Overall</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="12" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke="hsl(var(--primary))" strokeWidth="12" fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${completionPct * 3.52} ${100 * 3.52}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{completionPct}%</span>
                    <span className="text-xs text-muted-foreground">Complete</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-2xl font-bold text-success">{stats.completedTasks}</p>
                  <p className="text-muted-foreground">Completed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-muted-foreground">{stats.totalTasks - stats.completedTasks}</p>
                  <p className="text-muted-foreground">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Type Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Task Type</CardTitle>
                <Badge variant="secondary">Breakdown</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {taskTypeBreakdown.length > 0 ? (
                <>
                  <div className="h-[140px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskTypeBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {taskTypeBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                    {taskTypeBreakdown.map((item) => (
                      <div key={item.name}>
                        <p className="text-lg font-bold">{item.value}%</p>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  No tasks yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Up Next</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/roadmap">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    task.task_type === 'lesson' ? 'bg-primary/10 text-primary' :
                    task.task_type === 'project' ? 'bg-chart-2/10 text-chart-2' :
                    'bg-chart-3/10 text-chart-3'
                  }`}>
                    {task.task_type === 'lesson' ? <Play className="w-4 h-4" /> :
                     task.task_type === 'project' ? <Target className="w-4 h-4" /> :
                     <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.duration_minutes || 30} min</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-muted-foreground py-6">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
                  <p className="text-sm">All tasks complete!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
