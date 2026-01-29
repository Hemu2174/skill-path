import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Flame,
  Award,
  Calendar,
  ArrowUp,
  ChevronRight,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

const weeklyData = [
  { day: 'Mon', hours: 2.5, tasks: 4 },
  { day: 'Tue', hours: 1.8, tasks: 3 },
  { day: 'Wed', hours: 3.2, tasks: 5 },
  { day: 'Thu', hours: 2.0, tasks: 3 },
  { day: 'Fri', hours: 4.1, tasks: 6 },
  { day: 'Sat', hours: 1.5, tasks: 2 },
  { day: 'Sun', hours: 2.8, tasks: 4 },
];

const monthlyProgress = [
  { week: 'Week 1', score: 65, target: 70 },
  { week: 'Week 2', score: 72, target: 75 },
  { week: 'Week 3', score: 78, target: 80 },
  { week: 'Week 4', score: 85, target: 85 },
];

const skillsData = [
  { skill: 'React', level: 75, change: 12 },
  { skill: 'TypeScript', level: 45, change: 8 },
  { skill: 'CSS/Styling', level: 82, change: 5 },
  { skill: 'JavaScript', level: 88, change: 3 },
  { skill: 'Testing', level: 30, change: 15 },
];

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first lesson', earned: true, icon: '🎯' },
  { id: 2, title: 'Week Warrior', description: 'Study every day for a week', earned: true, icon: '🔥' },
  { id: 3, title: 'Quiz Master', description: 'Score 100% on any quiz', earned: true, icon: '🏆' },
  { id: 4, title: 'Project Builder', description: 'Complete your first project', earned: false, icon: '🚀' },
  { id: 5, title: 'Speed Learner', description: 'Complete 5 lessons in a day', earned: false, icon: '⚡' },
];

export default function Progress() {
  return (
    <DashboardLayout title="Progress">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">17.9h</p>
                  <div className="flex items-center gap-1 text-sm text-success mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+23% vs last week</span>
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
                  <p className="text-2xl font-bold">27</p>
                  <div className="flex items-center gap-1 text-sm text-success mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+8 this week</span>
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
                  <p className="text-2xl font-bold">12 days</p>
                  <p className="text-sm text-muted-foreground mt-1">Personal best!</p>
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
          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Hours spent learning each day</CardDescription>
                </div>
                <Badge variant="secondary">This week</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="hours" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Progress Score</CardTitle>
                  <CardDescription>Your score vs target</CardDescription>
                </div>
                <Badge variant="secondary">This month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[50, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Your Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Target</span>
                </div>
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
              {skillsData.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{skill.change}%
                      </Badge>
                    </div>
                  </div>
                  <ProgressBar value={skill.level} className="h-2" />
                </div>
              ))}
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
