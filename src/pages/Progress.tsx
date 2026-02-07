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
  Loader2
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
  Line
} from 'recharts';
import { useProgressData } from '@/hooks/useProgressData';
import { useSkillsProgress } from '@/hooks/useSkillsProgress';

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first lesson', earned: true, icon: '🎯' },
  { id: 2, title: 'Week Warrior', description: 'Study every day for a week', earned: true, icon: '🔥' },
  { id: 3, title: 'Quiz Master', description: 'Score 100% on any quiz', earned: true, icon: '🏆' },
  { id: 4, title: 'Project Builder', description: 'Complete your first project', earned: false, icon: '🚀' },
  { id: 5, title: 'Speed Learner', description: 'Complete 5 lessons in a day', earned: false, icon: '⚡' },
];

export default function Progress() {
  const { taskCompletionData, stats, loading } = useProgressData();
  const { skills: skillsData, loading: skillsLoading } = useSkillsProgress();

  if (loading) {
    return (
      <DashboardLayout title="Progress">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

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
                  <p className="text-sm text-muted-foreground">Tasks Done</p>
                  <p className="text-2xl font-bold">{stats.completedTasks}/{stats.totalTasks}</p>
                  <div className="flex items-center gap-1 text-sm text-success mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>{completionPercentage}% complete</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-chart-2/10 text-chart-2">
                  <Target className="w-6 h-6" />
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
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold">3/5</p>
                  <p className="text-sm text-muted-foreground mt-1">2 more to unlock</p>
                </div>
                <div className="p-3 rounded-xl bg-chart-3/10 text-chart-3">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Completion Over Time */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Task Completion Over Time</CardTitle>
                  <CardDescription>Completed vs total tasks by week</CardDescription>
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
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="hsl(var(--muted))" 
                        radius={[4, 4, 0, 0]}
                        name="Total Tasks"
                      />
                      <Bar 
                        dataKey="completed" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                        name="Completed"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Complete tasks to see your progress here</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate Area Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Completion Rate</CardTitle>
                  <CardDescription>Task completion trend by week</CardDescription>
                </div>
                <Badge variant="secondary">Trending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {taskCompletionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={taskCompletionData.map(d => ({
                        ...d,
                        rate: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0
                      }))}
                    >
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value}%`, 'Completion Rate']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fill="url(#colorRate)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Start completing tasks to track your progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills Progress</CardTitle>
                  <CardDescription>Your skill development over time</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
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
                          {skill.tasksCompleted}/{skill.totalTasks} tasks
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

          {/* Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Milestones you've reached</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
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
