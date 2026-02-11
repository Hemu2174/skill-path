import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Flame,
  Award,
  ArrowUp,
  ChevronRight,
  Loader2,
  Trophy,
  BookOpen,
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';
import { useProgressData } from '@/hooks/useProgressData';
import { useSkillsProgress } from '@/hooks/useSkillsProgress';
import { useCourseData } from '@/hooks/useCourseData';

export default function Progress() {
  const { taskCompletionData, stats, loading } = useProgressData();
  const { skills: skillsData, loading: skillsLoading } = useSkillsProgress();
  const { weeks, allWeeksCompleted } = useCourseData();

  if (loading) {
    return (
      <DashboardLayout title="Progress">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const completionPercentage = stats.totalConcepts > 0 
    ? Math.round((stats.completedConcepts / stats.totalConcepts) * 100) 
    : 0;

  // Dynamic achievements based on real data
  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first concept', earned: stats.completedConcepts >= 1, icon: '🎯' },
    { id: 2, title: 'Streak Starter', description: 'Achieve a 3-day learning streak', earned: stats.currentStreak >= 3, icon: '🔥' },
    { id: 3, title: 'Test Ace', description: 'Pass your first weekly test', earned: stats.testsPassed >= 1, icon: '🏆' },
    { id: 4, title: 'Half Way', description: 'Complete 50% of all concepts', earned: completionPercentage >= 50, icon: '🚀' },
    { id: 5, title: 'Course Master', description: 'Complete the entire course', earned: allWeeksCompleted, icon: '⚡' },
  ];

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <DashboardLayout title="Progress">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Spent</p>
                  <p className="text-2xl font-bold">{stats.hoursSpent}h</p>
                  <div className="flex items-center gap-1 text-sm text-success mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>Learning time</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Concepts Done</p>
                  <p className="text-2xl font-bold">{stats.completedConcepts}/{stats.totalConcepts}</p>
                  <div className="flex items-center gap-1 text-sm text-success mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>{completionPercentage}% complete</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-chart-2/10 text-chart-2">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{stats.currentStreak} days</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.currentStreak > 0 ? 'Keep it up!' : 'Start today!'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10 text-warning">
                  <Flame className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Passed</p>
                  <p className="text-2xl font-bold">{stats.testsPassed}/{stats.totalTests}</p>
                  <p className="text-sm text-muted-foreground mt-1">{earnedCount} achievements</p>
                </div>
                <div className="p-3 rounded-xl bg-chart-3/10 text-chart-3">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Concept Completion by Week</CardTitle>
                  <CardDescription>Completed vs total concepts per week</CardDescription>
                </div>
                <Badge variant="secondary">Real-time</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {taskCompletionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Total Concepts" />
                      <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Completed" />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Complete concepts to see your progress here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Completion Rate</CardTitle>
                  <CardDescription>Concept completion trend by week</CardDescription>
                </div>
                <Badge variant="secondary">Trending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {taskCompletionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={taskCompletionData.map(d => ({
                      ...d,
                      rate: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0
                    }))}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value) => [`${value}%`, 'Completion Rate']} />
                      <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRate)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Start completing concepts to track your progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills Progress</CardTitle>
                  <CardDescription>Concept mastery per week topic</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : skillsData.length > 0 ? (
                skillsData.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.tasksCompleted}/{skill.totalTasks} concepts
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar value={skill.level} className="h-2" />
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Complete onboarding to see your skills progress
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Milestones based on your real progress</CardDescription>
                </div>
                <Badge variant="secondary">{earnedCount}/{achievements.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                    achievement.earned
                      ? 'bg-primary/5 border border-primary/20'
                      : 'bg-muted/30 border border-border opacity-60'
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.earned ? (
                    <Badge className="bg-success text-success-foreground">Earned</Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
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
