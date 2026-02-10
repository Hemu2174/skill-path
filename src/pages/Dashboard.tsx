import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AIMentorCard } from '@/components/AIMentorCard';
import { supabase } from '@/integrations/supabase/client';
import { useCourseData } from '@/hooks/useCourseData';
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
  Loader2,
  BookOpen,
  Trophy,
  Award,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    roadmapTitle,
    weeks,
    overallProgress,
    started,
    loading: courseLoading,
    currentWeekNumber,
    allWeeksCompleted,
  } = useCourseData();

  const [userGoal, setUserGoal] = useState<any>(null);
  const [activityDays, setActivityDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: goals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setUserGoal(goals);

      // Activity days from concept_progress completed_at
      const { data: progressData } = await (supabase
        .from('concept_progress' as any) as any)
        .select('completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      const now = new Date();
      const days: number[] = (progressData || [])
        .filter((p: any) => p.completed_at && new Date(p.completed_at).getMonth() === now.getMonth())
        .map((p: any) => new Date(p.completed_at).getDate());
      setActivityDays([...new Set(days)]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Build per-week chart data from real course data
  const chartData = weeks.map(w => ({
    week: `W${w.week_number}`,
    total: w.totalConcepts,
    completed: w.completedConcepts,
  }));

  const totalConcepts = weeks.reduce((a, w) => a + w.totalConcepts, 0);
  const completedConcepts = weeks.reduce((a, w) => a + w.completedConcepts, 0);
  const passedTests = weeks.filter(w => w.testPassed).length;
  const completedWeeks = weeks.filter(w => w.status === 'completed').length;

  // Calendar
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

  const statCards = [
    { label: 'Course Progress', value: `${overallProgress}%`, change: `${completedConcepts}/${totalConcepts} concepts`, icon: TrendingUp, color: 'text-chart-1' },
    { label: 'Weeks Completed', value: `${completedWeeks}/${weeks.length}`, change: `${passedTests} tests passed`, icon: Trophy, color: 'text-chart-2' },
    { label: 'Concepts Mastered', value: `${completedConcepts}`, change: `of ${totalConcepts} total`, icon: BookOpen, color: 'text-chart-3' },
    { label: 'Active Days', value: `${activityDays.length}`, change: 'This month', icon: Flame, color: 'text-warning' },
  ];

  if (loading || courseLoading) {
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
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Learner'}! 👋
            </h2>
            <p className="text-muted-foreground mt-1">
              {allWeeksCompleted
                ? "You've completed all weeks! Take the Final Assessment."
                : !started
                ? "Start your course to begin learning."
                : `You're on Week ${currentWeekNumber}. Keep the momentum going!`}
            </p>
          </div>
          <Button asChild className="gradient-primary">
            <Link to={started ? '/courses' : '/onboarding'}>
              {started ? 'Continue Learning' : 'Get Started'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Concept Progress Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Concept Progress by Week</CardTitle>
                <CardDescription>Total vs Completed concepts</CardDescription>
              </div>
              <Badge variant="secondary">Real-time</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(280, 75%, 55%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(280, 75%, 55%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="total" stroke="hsl(262, 83%, 58%)" strokeWidth={2} fill="url(#totalGrad)" name="Total" />
                      <Area type="monotone" dataKey="completed" stroke="hsl(280, 75%, 55%)" strokeWidth={2} fill="url(#completedGrad)" name="Completed" />
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

          {/* Activity Calendar */}
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
                          day === null ? '' :
                          activityDays.includes(day) ? 'bg-primary/20 text-primary' :
                          'bg-muted text-muted-foreground hover:bg-muted/80'
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
          {/* Course Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="12" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke="hsl(var(--primary))" strokeWidth="12" fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${overallProgress * 3.52} ${100 * 3.52}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{overallProgress}%</span>
                    <span className="text-xs text-muted-foreground">Progress</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-2xl font-bold text-success">{completedConcepts}</p>
                  <p className="text-muted-foreground">Concepts Done</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-muted-foreground">{totalConcepts - completedConcepts}</p>
                  <p className="text-muted-foreground">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Week Progress */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Week Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeks.slice(0, 6).map((w) => (
                <div key={w.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    w.status === 'completed' ? 'bg-success text-success-foreground' :
                    w.status === 'active' ? 'gradient-primary text-white' :
                    w.status === 'extended' ? 'bg-warning text-warning-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {w.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : w.week_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{w.title}</p>
                    <Progress value={w.totalConcepts > 0 ? (w.completedConcepts / w.totalConcepts) * 100 : 0} className="h-1.5 mt-1" />
                  </div>
                  {w.testPassed && <Trophy className="w-4 h-4 text-success shrink-0" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {started && currentWeekNumber > 0 && (
                <Button className="w-full justify-start gradient-primary" onClick={() => {
                  const activeWeek = weeks.find(w => w.status === 'active' || w.status === 'extended');
                  if (activeWeek) navigate(`/learn/${activeWeek.id}`);
                }}>
                  <Play className="w-4 h-4 mr-2" /> Continue Learning
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/courses"><BookOpen className="w-4 h-4 mr-2" /> View Course</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/weekly-checkin"><Calendar className="w-4 h-4 mr-2" /> Weekly Check-in</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/progress"><TrendingUp className="w-4 h-4 mr-2" /> View Progress</Link>
              </Button>
              {allWeeksCompleted && (
                <Button variant="outline" className="w-full justify-start border-primary text-primary" asChild>
                  <Link to="/final-assessment"><Award className="w-4 h-4 mr-2" /> Final Assessment</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Mentor */}
        <AIMentorCard compact />
      </div>
    </DashboardLayout>
  );
}
