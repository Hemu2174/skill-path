import { useNavigate } from 'react-router-dom';
import { useCourseData } from '@/hooks/useCourseData';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  BookOpen, 
  Trophy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Roadmap() {
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
  } = useCourseData();

  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks(prev =>
      prev.includes(weekId) ? prev.filter(id => id !== weekId) : [...prev, weekId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'active': return 'gradient-primary text-white';
      case 'extended': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'active': return 'In Progress';
      case 'extended': return 'Extended';
      case 'locked': return 'Locked';
      default: return status;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Learning Roadmap">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!roadmapId || weeks.length === 0) {
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
              <Link to="/onboarding">Start Onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const totalCompleted = weeks.filter(w => w.status === 'completed').length;

  return (
    <DashboardLayout title="Learning Roadmap">
      <div className="space-y-6">
        {/* Header */}
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
                  {currentWeekNumber > 0
                    ? `Week ${currentWeekNumber} of ${weeks.length}`
                    : allWeeksCompleted
                    ? 'All weeks completed!'
                    : `${weeks.length} weeks`}
                </span>
                <span>{totalCompleted}/{weeks.length} weeks completed</span>
              </div>
              <Progress value={overallProgress} className="h-2 bg-white/20" />
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
                {!started
                  ? "Start your course to begin your learning journey!"
                  : allWeeksCompleted
                  ? "All weeks completed! Take the Final Grand Assessment."
                  : `Keep going! You're making progress on Week ${currentWeekNumber}.`}
              </p>
            </div>
            {allWeeksCompleted && (
              <Button onClick={() => navigate('/final-assessment')} className="gradient-primary" size="sm">
                <Trophy className="w-4 h-4 mr-1" /> Final Assessment
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Weeks Timeline */}
        <div className="space-y-4">
          {weeks.map((week) => {
            const isExpanded = expandedWeeks.includes(week.id);
            const isAccessible = week.status !== 'locked';
            const weekProgress = week.totalConcepts > 0
              ? Math.round((week.completedConcepts / week.totalConcepts) * 100)
              : 0;

            return (
              <Card
                key={week.id}
                className={cn(
                  'transition-all duration-200',
                  !isAccessible && 'opacity-60',
                  week.status === 'active' && 'ring-2 ring-primary shadow-glow',
                  week.status === 'extended' && 'ring-2 ring-warning',
                )}
              >
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => isAccessible && toggleWeek(week.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
                      getStatusColor(week.status)
                    )}>
                      {week.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                       week.status === 'locked' ? <Lock className="w-5 h-5" /> :
                       week.status === 'extended' ? <AlertTriangle className="w-5 h-5" /> :
                       week.week_number}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{week.title}</CardTitle>
                        <Badge
                          variant={isAccessible ? 'default' : 'secondary'}
                          className={cn(
                            week.status === 'completed' && 'bg-success',
                            week.status === 'active' && 'gradient-primary',
                            week.status === 'extended' && 'bg-warning',
                          )}
                        >
                          {getStatusLabel(week.status)}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">{week.description}</CardDescription>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{weekProgress}%</p>
                        <p className="text-xs text-muted-foreground">
                          {week.completedConcepts}/{week.totalConcepts} concepts
                        </p>
                      </div>
                      {isAccessible && (
                        isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                   : <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <Progress value={weekProgress} className="mt-4 h-2" />
                </CardHeader>

                {isExpanded && isAccessible && (
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
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
                    <div className="flex gap-3">
                      <Button
                        onClick={() => navigate(`/learn/${week.id}`)}
                        className={cn(
                          week.status === 'extended' ? 'bg-warning hover:bg-warning/90' : 'gradient-primary'
                        )}
                      >
                        {week.status === 'completed' ? (
                          <>Review <ChevronRight className="w-4 h-4 ml-1" /></>
                        ) : week.status === 'extended' ? (
                          <>Review & Retry <AlertTriangle className="w-4 h-4 ml-1" /></>
                        ) : (
                          <><Play className="w-4 h-4 mr-1" /> Continue Learning</>
                        )}
                      </Button>
                      {week.status !== 'locked' && week.completedConcepts === week.totalConcepts && week.totalConcepts > 0 && (
                        <Button variant="outline" onClick={() => navigate(`/weekly-test/${week.id}`)}>
                          <Trophy className="w-4 h-4 mr-1" />
                          {week.testPassed ? 'Review Test' : 'Take Test'}
                        </Button>
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
