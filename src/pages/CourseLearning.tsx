import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  Clock,
  Code,
  Video,
  FlaskConical,
  Trophy,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Concept {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  video_required_seconds: number;
  order_index: number;
}

interface ConceptProgressData {
  concept_id: string;
  video_watch_seconds: number;
  video_completed: boolean;
  practice_completed: boolean;
  is_completed: boolean;
}

export default function CourseLearning() {
  const { weekId } = useParams<{ weekId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, ConceptProgressData>>({});
  const [weekTitle, setWeekTitle] = useState('');
  const [weekNumber, setWeekNumber] = useState(0);
  const [weekStatus, setWeekStatus] = useState('active');
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [submittingPractice, setSubmittingPractice] = useState(false);

  // Video timer
  const [videoWatchTime, setVideoWatchTime] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeConcept = concepts[activeConceptIndex];
  const activeProgress = activeConcept ? progressMap[activeConcept.id] : null;

  const fetchData = useCallback(async () => {
    if (!user || !weekId) return;

    try {
      // Fetch week info
      const { data: week } = await supabase
        .from('roadmap_weeks')
        .select('*')
        .eq('id', weekId)
        .single();

      if (!week) {
        navigate('/courses');
        return;
      }

      setWeekTitle(week.title);
      setWeekNumber(week.week_number);
      setWeekStatus((week as any).status || 'locked');

      // Check if week is accessible
      if ((week as any).status === 'locked') {
        toast.error('This week is locked. Complete the previous week first.');
        navigate('/courses');
        return;
      }

      // Fetch concepts
      const { data: conceptsData } = await (supabase
        .from('concepts' as any) as any)
        .select('*')
        .eq('week_id', weekId)
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      setConcepts(conceptsData || []);

      // Fetch progress
      if (conceptsData && conceptsData.length > 0) {
        const conceptIds = conceptsData.map(c => c.id);
        const { data: progressData } = await (supabase
          .from('concept_progress' as any) as any)
          .select('*')
          .eq('user_id', user.id)
          .in('concept_id', conceptIds);

        const map: Record<string, ConceptProgressData> = {};
        (progressData || []).forEach(p => {
          map[p.concept_id] = p;
        });
        setProgressMap(map);

        // Find first incomplete concept
        const firstIncomplete = conceptsData.findIndex(c => !map[c.id]?.is_completed);
        if (firstIncomplete >= 0) {
          setActiveConceptIndex(firstIncomplete);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user, weekId, navigate]);

  useEffect(() => {
    fetchData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData]);

  // Video watch timer
  useEffect(() => {
    if (videoPlaying && activeConcept && !activeProgress?.video_completed) {
      timerRef.current = setInterval(() => {
        setVideoWatchTime(prev => {
          const newTime = prev + 1;
          // Save every 10 seconds
          if (newTime % 10 === 0) {
            saveVideoProgress(activeConcept.id, newTime);
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [videoPlaying, activeConcept?.id, activeProgress?.video_completed]);

  // Reset watch time when changing concepts
  useEffect(() => {
    if (activeConcept) {
      const existing = progressMap[activeConcept.id];
      setVideoWatchTime(existing?.video_watch_seconds || 0);
      setVideoPlaying(false);
      setPracticeAnswer('');
    }
  }, [activeConceptIndex]);

  const saveVideoProgress = async (conceptId: string, watchSeconds: number) => {
    if (!user) return;
    const isComplete = watchSeconds >= (activeConcept?.video_required_seconds || 120);

    const { error } = await (supabase
      .from('concept_progress' as any) as any)
      .upsert({
        user_id: user.id,
        concept_id: conceptId,
        video_watch_seconds: watchSeconds,
        video_completed: isComplete,
      }, { onConflict: 'user_id,concept_id' });

    if (!error && isComplete) {
      setProgressMap(prev => ({
        ...prev,
        [conceptId]: {
          ...(prev[conceptId] || { concept_id: conceptId, practice_completed: false, is_completed: false }),
          video_watch_seconds: watchSeconds,
          video_completed: true,
        },
      }));
      setVideoPlaying(false);
      toast.success('Video requirement met! Now complete the hands-on practice.');
    }
  };

  const handleMarkVideoComplete = async () => {
    if (!activeConcept || !user) return;
    const required = activeConcept.video_required_seconds;
    if (videoWatchTime < required) {
      toast.error(`Watch at least ${Math.ceil(required / 60)} minutes of the video.`);
      return;
    }
    await saveVideoProgress(activeConcept.id, videoWatchTime);
  };

  const handleSubmitPractice = async () => {
    if (!activeConcept || !user || !practiceAnswer.trim()) {
      toast.error('Please write your solution before submitting.');
      return;
    }

    setSubmittingPractice(true);
    try {
      const { error } = await (supabase
        .from('concept_progress' as any) as any)
        .upsert({
          user_id: user.id,
          concept_id: activeConcept.id,
          practice_completed: true,
          is_completed: true,
          completed_at: new Date().toISOString(),
          video_watch_seconds: videoWatchTime,
          video_completed: true,
        }, { onConflict: 'user_id,concept_id' });

      if (error) throw error;

      setProgressMap(prev => ({
        ...prev,
        [activeConcept.id]: {
          concept_id: activeConcept.id,
          video_watch_seconds: videoWatchTime,
          video_completed: true,
          practice_completed: true,
          is_completed: true,
        },
      }));

      toast.success('Practice completed! Concept mastered 🎉');

      // Auto-advance to next concept
      if (activeConceptIndex < concepts.length - 1) {
        setTimeout(() => setActiveConceptIndex(activeConceptIndex + 1), 1000);
      }
    } catch (error) {
      toast.error('Failed to save practice.');
    } finally {
      setSubmittingPractice(false);
    }
  };

  const allConceptsCompleted = concepts.length > 0 && concepts.every(c => progressMap[c.id]?.is_completed);
  const completedCount = concepts.filter(c => progressMap[c.id]?.is_completed).length;
  const weekProgress = concepts.length > 0 ? Math.round((completedCount / concepts.length) * 100) : 0;

  if (loading) {
    return (
      <DashboardLayout title="Learning">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={weekTitle || 'Learning'}>
      <div className="space-y-6">
        {/* Week Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold">{weekTitle}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {completedCount}/{concepts.length} concepts completed
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{weekProgress}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
                {allConceptsCompleted && (
                  <Button onClick={() => navigate(`/weekly-test/${weekId}`)} className="gradient-primary">
                    <Trophy className="w-4 h-4 mr-2" />
                    Take Weekly Test
                  </Button>
                )}
              </div>
            </div>
            <Progress value={weekProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Concept Sidebar */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Concepts</h3>
            {concepts.map((concept, index) => {
              const progress = progressMap[concept.id];
              const isActive = index === activeConceptIndex;
              const isCompleted = progress?.is_completed;
              const isAccessible = index === 0 || progressMap[concepts[index - 1]?.id]?.is_completed;

              return (
                <button
                  key={concept.id}
                  onClick={() => isAccessible && setActiveConceptIndex(index)}
                  disabled={!isAccessible}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3',
                    isActive && 'border-primary bg-primary/5 ring-1 ring-primary',
                    isCompleted && !isActive && 'border-success/30 bg-success/5',
                    !isAccessible && 'opacity-50 cursor-not-allowed',
                    !isActive && isAccessible && !isCompleted && 'border-border hover:border-primary/50'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    isCompleted ? 'bg-success text-success-foreground' :
                    isActive ? 'gradient-primary text-white' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                     !isAccessible ? <Lock className="w-3 h-3" /> :
                     index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('text-sm font-medium truncate', isCompleted && 'line-through text-muted-foreground')}>
                      {concept.title}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {progress?.video_completed && <Badge variant="outline" className="text-[10px] px-1 py-0">📹</Badge>}
                      {progress?.practice_completed && <Badge variant="outline" className="text-[10px] px-1 py-0">💻</Badge>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {activeConcept && (
              <>
                {/* Concept Title */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg gradient-primary">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>{activeConcept.title}</CardTitle>
                        <CardDescription>{activeConcept.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Step 1: Video */}
                <Card className={cn(activeProgress?.video_completed && 'border-success/30')}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Step 1: Watch Video
                        {activeProgress?.video_completed && (
                          <Badge className="bg-success text-success-foreground ml-2">Completed</Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {Math.floor(videoWatchTime / 60)}:{(videoWatchTime % 60).toString().padStart(2, '0')}
                        {' / '}
                        {Math.ceil(activeConcept.video_required_seconds / 60)}:00 min required
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeConcept.video_url ? (
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${activeConcept.video_url}?rel=0`}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={activeConcept.title}
                          />
                        </div>
                        {!activeProgress?.video_completed && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={Math.min(100, (videoWatchTime / activeConcept.video_required_seconds) * 100)}
                                className="w-48 h-2"
                              />
                              <span className="text-sm text-muted-foreground">
                                {Math.min(100, Math.round((videoWatchTime / activeConcept.video_required_seconds) * 100))}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant={videoPlaying ? 'destructive' : 'default'}
                                size="sm"
                                onClick={() => setVideoPlaying(!videoPlaying)}
                              >
                                {videoPlaying ? 'Pause Timer' : 'Start Watching'}
                                <Play className="w-4 h-4 ml-1" />
                              </Button>
                              {videoWatchTime >= activeConcept.video_required_seconds && (
                                <Button size="sm" onClick={handleMarkVideoComplete} className="gradient-primary">
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                        {!activeProgress?.video_completed && (
                          <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 p-3 rounded-lg">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>You must watch the minimum required duration before proceeding. No skipping allowed.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No video available for this concept.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Step 2: Hands-on Practice */}
                <Card className={cn(
                  !activeProgress?.video_completed && 'opacity-60',
                  activeProgress?.practice_completed && 'border-success/30'
                )}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="w-5 h-5 text-chart-2" />
                      Step 2: Hands-on Practice
                      {activeProgress?.practice_completed && (
                        <Badge className="bg-success text-success-foreground ml-2">Completed</Badge>
                      )}
                      {!activeProgress?.video_completed && (
                        <Badge variant="outline" className="ml-2">
                          <Lock className="w-3 h-3 mr-1" />
                          Complete video first
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeProgress?.video_completed ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted/50 border border-border">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-chart-2" />
                            Practice Task
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {/* Practice task from concept data would be stored in description or a separate field */}
                            Complete the hands-on coding exercise related to "{activeConcept.title}". Write your solution below and submit when ready.
                          </p>
                        </div>
                        {!activeProgress?.practice_completed && (
                          <>
                            <Textarea
                              value={practiceAnswer}
                              onChange={e => setPracticeAnswer(e.target.value)}
                              placeholder="Write your solution here... Describe what you built, paste code snippets, or explain your approach."
                              className="min-h-[200px] font-mono text-sm"
                            />
                            <div className="flex justify-end">
                              <Button
                                onClick={handleSubmitPractice}
                                disabled={submittingPractice || !practiceAnswer.trim()}
                                className="gradient-primary"
                              >
                                {submittingPractice ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                Submit Practice
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Complete the video lesson to unlock this practice task.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveConceptIndex(Math.max(0, activeConceptIndex - 1))}
                    disabled={activeConceptIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Concept {activeConceptIndex + 1} of {concepts.length}
                  </div>

                  {activeConceptIndex < concepts.length - 1 ? (
                    <Button
                      onClick={() => setActiveConceptIndex(activeConceptIndex + 1)}
                      disabled={!progressMap[activeConcept?.id]?.is_completed}
                    >
                      Next Concept
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : allConceptsCompleted ? (
                    <Button onClick={() => navigate(`/weekly-test/${weekId}`)} className="gradient-primary">
                      <Trophy className="w-4 h-4 mr-2" />
                      Take Weekly Test
                    </Button>
                  ) : (
                    <Button disabled variant="outline">
                      Complete all concepts first
                    </Button>
                  )}
                </div>
              </>
            )}

            {concepts.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No concepts found for this week.</p>
                  <Button className="mt-4" onClick={() => navigate('/courses')}>Back to Courses</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
