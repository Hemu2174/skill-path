import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AIMentorCard } from '@/components/AIMentorCard';
import { supabase } from '@/integrations/supabase/client';
import { useCourseData } from '@/hooks/useCourseData';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Calendar,
  ArrowRight,
  Lightbulb,
  Flame,
  Trophy,
  BookOpen,
  Loader2,
} from 'lucide-react';

interface WeeklyReport {
  id: string;
  week_number: number;
  tasks_completed: number;
  hours_spent: number;
  progress_score: number;
  ai_feedback: string | null;
  created_at: string;
}

export default function WeeklyCheckin() {
  const { user } = useAuth();
  const { weeks, overallProgress, currentWeekNumber, loading: courseLoading } = useCourseData();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentReport, setCurrentReport] = useState<WeeklyReport | null>(null);
  const [previousReports, setPreviousReports] = useState<WeeklyReport[]>([]);
  const [weekStats, setWeekStats] = useState({
    conceptsCompleted: 0,
    hoursSpent: 0,
    progressScore: 0,
    currentWeek: 1,
    testsPassed: 0,
  });

  useEffect(() => {
    if (!user || courseLoading) return;
    fetchData();
  }, [user, courseLoading, weeks]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Derive stats from real course data
      const completedConcepts = weeks.reduce((a, w) => a + w.completedConcepts, 0);
      const testsPassed = weeks.filter(w => w.testPassed).length;

      // Fetch watch time for hours calculation
      const { data: conceptProgress } = await (supabase
        .from('concept_progress' as any) as any)
        .select('video_watch_seconds, is_completed')
        .eq('user_id', user.id);

      const totalSeconds = (conceptProgress || []).reduce((acc: number, p: any) => acc + (p.video_watch_seconds || 0), 0);
      const practiceMinutes = (conceptProgress || []).filter((p: any) => p.is_completed).length * 15;
      const hoursSpent = Math.round(((totalSeconds / 3600) + (practiceMinutes / 60)) * 10) / 10;

      setWeekStats({
        conceptsCompleted: completedConcepts,
        hoursSpent,
        progressScore: overallProgress,
        currentWeek: currentWeekNumber || 1,
        testsPassed,
      });

      // Fetch existing reports
      const { data: reports } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('week_number', { ascending: false });

      if (reports && reports.length > 0) {
        const current = reports.find(r => r.week_number === (currentWeekNumber || 1));
        setCurrentReport(current || null);
        setPreviousReports(reports.filter(r => r.week_number !== (currentWeekNumber || 1)));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCheckin = async () => {
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      // Use the weekly-feedback edge function for AI-powered check-in feedback
      const response = await supabase.functions.invoke('weekly-feedback', {
        body: {
          weekTitle: `Week ${weekStats.currentWeek} Check-in`,
          weekNumber: weekStats.currentWeek,
          testScore: weekStats.progressScore,
          testPassed: true,
          correctAnswers: weekStats.conceptsCompleted,
          totalQuestions: weeks.reduce((a, w) => a + w.totalConcepts, 0),
        },
      });

      const aiFeedback = response.data?.feedback || 
        `You've completed ${weekStats.conceptsCompleted} concepts and ${weekStats.testsPassed} tests in ${weekStats.hoursSpent}h of learning. Keep up the great work!`;

      const { data, error } = await supabase
        .from('weekly_reports')
        .insert({
          user_id: user.id,
          week_number: weekStats.currentWeek,
          tasks_completed: weekStats.conceptsCompleted,
          hours_spent: weekStats.hoursSpent,
          progress_score: weekStats.progressScore,
          ai_feedback: aiFeedback,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentReport(data);
      toast.success('Weekly check-in completed! Check out your AI feedback.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit check-in');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || courseLoading) {
    return (
      <DashboardLayout title="Weekly Check-in">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Weekly Check-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Calendar className="w-7 h-7 text-primary" />
              Week {weekStats.currentWeek} Check-in
            </h2>
            <p className="text-muted-foreground mt-1">
              Review your progress and get personalized AI feedback
            </p>
          </div>
          {!currentReport && (
            <Button 
              onClick={handleSubmitCheckin} 
              disabled={submitting}
              className="gradient-primary"
            >
              {submitting ? 'Generating Feedback...' : 'Complete Check-in'}
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Concepts Completed</p>
                  <p className="text-2xl font-bold">{weekStats.conceptsCompleted}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total mastered</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Invested</p>
                  <p className="text-2xl font-bold">{weekStats.hoursSpent}h</p>
                  <p className="text-xs text-muted-foreground mt-1">Video + Practice</p>
                </div>
                <div className="p-2 rounded-lg bg-chart-2/10 text-chart-2">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{weekStats.progressScore}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Course completion</p>
                </div>
                <div className="p-2 rounded-lg bg-chart-3/10 text-chart-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Passed</p>
                  <p className="text-2xl font-bold">{weekStats.testsPassed}/{weeks.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Weekly tests</p>
                </div>
                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Feedback Section */}
        {currentReport ? (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    AI Mentor Feedback
                    <Badge variant="secondary">Week {currentReport.week_number}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Personalized insights based on your learning activity
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-card rounded-lg p-6 border border-border whitespace-pre-wrap">
                {currentReport.ai_feedback}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-card rounded-lg border border-border">
                  <p className="text-2xl font-bold text-primary">{currentReport.tasks_completed}</p>
                  <p className="text-sm text-muted-foreground">Concepts Done</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border border-border">
                  <p className="text-2xl font-bold text-chart-2">{currentReport.hours_spent}h</p>
                  <p className="text-sm text-muted-foreground">Hours Spent</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border border-border">
                  <p className="text-2xl font-bold text-chart-3">{currentReport.progress_score}%</p>
                  <p className="text-sm text-muted-foreground">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No check-in yet this week</h3>
              <p className="text-muted-foreground mb-4">
                Complete your weekly check-in to receive personalized AI feedback and insights.
              </p>
              <Button onClick={handleSubmitCheckin} disabled={submitting}>
                {submitting ? 'Generating...' : 'Start Check-in'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Mentor */}
        <AIMentorCard />

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              Learning Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-warning" />
                  Stay Consistent
                </h4>
                <p className="text-sm text-muted-foreground">
                  Try to learn at the same time each day to build a strong habit.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-chart-2/5 border border-chart-2/10">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-chart-2" />
                  Practice More
                </h4>
                <p className="text-sm text-muted-foreground">
                  Apply what you learn through hands-on projects and exercises.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-chart-3/5 border border-chart-3/10">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-chart-3" />
                  Celebrate Wins
                </h4>
                <p className="text-sm text-muted-foreground">
                  Acknowledge your progress, no matter how small it seems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Reports */}
        {previousReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Previous Check-ins</CardTitle>
              <CardDescription>Review your past weekly summaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previousReports.map((report) => (
                <div 
                  key={report.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">Week {report.week_number}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2">{report.ai_feedback}</p>
                  <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                    <span>{report.tasks_completed} concepts</span>
                    <span>{report.hours_spent}h spent</span>
                    <span>{report.progress_score}% score</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
