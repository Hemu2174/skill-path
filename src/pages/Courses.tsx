import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCourseData } from '@/hooks/useCourseData';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Play,
  Clock,
  BookOpen,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Sparkles,
  Trophy,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    roadmapId,
    roadmapTitle,
    roadmapDescription,
    weeks,
    overallProgress,
    started,
    loading,
    currentWeekNumber,
    allWeeksCompleted,
    refreshData,
  } = useCourseData();

  const [starting, setStarting] = useState(false);

  const handleStartCourse = async () => {
    if (!user || !roadmapId) return;
    setStarting(true);

    try {
      // Set week 1 to active
      const week1 = weeks.find(w => w.week_number === 1);
      if (week1) {
        await (supabase
          .from('roadmap_weeks') as any)
          .update({ status: 'active' })
          .eq('id', week1.id);

        await refreshData();
        toast.success('Course started! Begin with Week 1.');
        navigate(`/learn/${week1.id}`);
      }
    } catch (error) {
      toast.error('Failed to start course.');
    } finally {
      setStarting(false);
    }
  };

  const getWeekStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'active': return 'gradient-primary text-white';
      case 'extended': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getWeekStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'active': return 'In Progress';
      case 'extended': return 'Extended - Review Required';
      case 'locked': return 'Locked';
      default: return status;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Course">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!roadmapId || weeks.length === 0) {
    return (
      <DashboardLayout title="My Course">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-display font-bold mb-2">No Course Yet</h2>
            <p className="text-muted-foreground mb-4">
              Complete your onboarding to generate a personalized learning course.
            </p>
            <Button asChild className="gradient-primary">
              <Link to="/onboarding">Start Onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Course">
      <div className="space-y-6">
        {/* Course Header */}
        <Card className="overflow-hidden">
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">{roadmapTitle}</h2>
                <p className="text-white/80">{roadmapDescription}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{overallProgress}%</p>
                <p className="text-white/80 text-sm">Overall Progress</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>
                  {started
                    ? currentWeekNumber > 0
                      ? `Currently on Week ${currentWeekNumber}`
                      : allWeeksCompleted ? 'All weeks completed!' : 'Course in progress'
                    : 'Not started yet'}
                </span>
                <span>{weeks.length} weeks</span>
              </div>
              <Progress value={overallProgress} className="h-2 bg-white/20" />
            </div>
          </div>
        </Card>

        {/* Start Course Button */}
        {!started && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Ready to begin your learning journey?</h3>
                <p className="text-muted-foreground">Click Start Course to unlock Week 1 and begin learning.</p>
              </div>
              <Button onClick={handleStartCourse} disabled={starting} className="gradient-primary" size="lg">
                {starting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                Start Course
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Final Assessment Card */}
        {allWeeksCompleted && (
          <Card className="border-2 border-primary bg-primary/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl gradient-primary">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Final Grand Assessment Unlocked! 🎉</h3>
                  <p className="text-muted-foreground">All weeks completed. Take the final assessment to earn your certificate.</p>
                </div>
              </div>
              <Button onClick={() => navigate('/final-assessment')} className="gradient-primary" size="lg">
                <Trophy className="w-4 h-4 mr-2" />
                Take Final Assessment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Weeks List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Course Weeks</h3>
          {weeks.map((week) => {
            const isAccessible = week.status === 'active' || week.status === 'completed' || week.status === 'extended';
            const weekProgress = week.totalConcepts > 0 ? Math.round((week.completedConcepts / week.totalConcepts) * 100) : 0;

            return (
              <Card
                key={week.id}
                className={cn(
                  'transition-all duration-200',
                  !isAccessible && 'opacity-60',
                  week.status === 'active' && 'ring-2 ring-primary shadow-glow',
                  week.status === 'extended' && 'ring-2 ring-warning'
                )}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Week Number */}
                    <div className={cn(
                      'md:w-24 h-20 md:h-auto flex items-center justify-center text-2xl font-bold',
                      getWeekStatusColor(week.status)
                    )}>
                      {week.status === 'completed' ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : week.status === 'locked' ? (
                        <Lock className="w-6 h-6" />
                      ) : week.status === 'extended' ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        week.week_number
                      )}
                    </div>

                    {/* Week Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-display font-semibold">{week.title}</h3>
                            <Badge variant={isAccessible ? 'default' : 'secondary'} className={cn(
                              week.status === 'completed' && 'bg-success',
                              week.status === 'extended' && 'bg-warning',
                            )}>
                              {getWeekStatusLabel(week.status)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">{week.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {week.completedConcepts}/{week.totalConcepts} concepts
                        </span>
                        {week.testScore !== null && (
                          <span className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            Test: {week.testScore}%
                            {week.testPassed && <CheckCircle2 className="w-3 h-3 text-success" />}
                          </span>
                        )}
                      </div>

                      <Progress value={weekProgress} className="mt-3 h-2" />
                    </div>

                    {/* Action */}
                    <div className="p-6 flex items-center border-t md:border-t-0 md:border-l border-border">
                      {isAccessible ? (
                        <Button
                          onClick={() => navigate(`/learn/${week.id}`)}
                          className={cn(week.status === 'extended' ? 'bg-warning hover:bg-warning/90' : 'gradient-primary')}
                        >
                          {week.status === 'completed' ? (
                            <>Review <ChevronRight className="w-4 h-4 ml-1" /></>
                          ) : week.status === 'extended' ? (
                            <>Review & Retry <AlertTriangle className="w-4 h-4 ml-1" /></>
                          ) : (
                            <><Play className="w-4 h-4 mr-2" /> Continue</>
                          )}
                        </Button>
                      ) : (
                        <Button disabled variant="outline">
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
