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
  Award,
  Flame,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const performanceData = [
  { week: 'Week 1', theory: 65, practice: 45 },
  { week: 'Week 2', theory: 75, practice: 55 },
  { week: 'Week 3', theory: 80, practice: 70 },
  { week: 'Week 4', theory: 85, practice: 82 },
];

const taskTypeData = [
  { name: 'Research', value: 68, color: 'hsl(262, 83%, 58%)' },
  { name: 'Practice', value: 22, color: 'hsl(280, 75%, 55%)' },
  { name: 'Projects', value: 10, color: 'hsl(240, 60%, 60%)' },
];

const upcomingTasks = [
  { id: 1, title: 'Complete React Fundamentals', type: 'lesson', duration: '45 min', dueToday: true },
  { id: 2, title: 'Build a Todo App', type: 'project', duration: '2 hours', dueToday: false },
  { id: 3, title: 'TypeScript Basics Quiz', type: 'quiz', duration: '20 min', dueToday: false },
];

const activityDays = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, null, null, null, null],
];

const activeDays = [3, 4, 5, 10, 11, 14, 17, 18, 19, 25, 26, 27];
const milestoneDays = [11, 25];

export default function Dashboard() {
  const { user } = useAuth();
  const [userGoal, setUserGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setUserGoal(data);
      setLoading(false);
    }
    
    fetchData();
  }, [user]);

  const stats = [
    { 
      label: 'Learning Hours', 
      value: '42.5', 
      change: '+5.2 this week',
      icon: Clock,
      color: 'text-chart-1'
    },
    { 
      label: 'Progress Score', 
      value: '602', 
      change: '+18% vs last week',
      icon: TrendingUp,
      color: 'text-chart-2'
    },
    { 
      label: 'Tasks Completed', 
      value: '24/32', 
      change: '75% complete',
      icon: Target,
      color: 'text-chart-3'
    },
    { 
      label: 'Current Streak', 
      value: '7 days', 
      change: 'Keep it up!',
      icon: Flame,
      color: 'text-warning'
    },
  ];

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
              You're making great progress. Keep up the momentum!
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
          {stats.map((stat) => (
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
                <CardTitle className="text-lg">Performance Chart</CardTitle>
                <CardDescription>Theory vs Practice progress</CardDescription>
              </div>
              <Badge variant="secondary">This month</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
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
                    />
                    <Area 
                      type="monotone" 
                      dataKey="practice" 
                      stroke="hsl(280, 75%, 55%)" 
                      strokeWidth={2}
                      fill="url(#practiceGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Theory</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-2" />
                  <span className="text-sm text-muted-foreground">Practice</span>
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
                {activityDays.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                          day === null
                            ? ''
                            : milestoneDays.includes(day)
                            ? 'bg-primary text-primary-foreground'
                            : activeDays.includes(day)
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
                  <span>11 Regular Activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span>3 Key Milestone</span>
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
                <Badge variant="secondary">This month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--primary))"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${75 * 3.52} ${100 * 3.52}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">75%</span>
                    <span className="text-xs text-muted-foreground">Complete</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-2xl font-bold text-success">75%</p>
                  <p className="text-muted-foreground">Completed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-muted-foreground">25%</p>
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
                <Badge variant="secondary">This month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[140px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {taskTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                {taskTypeData.map((item) => (
                  <div key={item.name}>
                    <p className="text-lg font-bold">{item.value}%</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/schedule">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    task.type === 'lesson' ? 'bg-primary/10 text-primary' :
                    task.type === 'project' ? 'bg-chart-2/10 text-chart-2' :
                    'bg-chart-3/10 text-chart-3'
                  }`}>
                    {task.type === 'lesson' ? <Play className="w-4 h-4" /> :
                     task.type === 'project' ? <Target className="w-4 h-4" /> :
                     <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.duration}</p>
                  </div>
                  {task.dueToday && (
                    <Badge variant="secondary" className="text-xs">Due today</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
