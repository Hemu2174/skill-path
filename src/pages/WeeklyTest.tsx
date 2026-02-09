import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Loader2,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function WeeklyTest() {
  const { weekId } = useParams<{ weekId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [testId, setTestId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [passThreshold, setPassThreshold] = useState(60);
  const [weekTitle, setWeekTitle] = useState('');
  const [weekNumber, setWeekNumber] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previousAttempts, setPreviousAttempts] = useState<any[]>([]);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user, weekId]);

  const fetchData = async () => {
    if (!user || !weekId) return;

    try {
      // Fetch week info
      const { data: week } = await supabase
        .from('roadmap_weeks')
        .select('*')
        .eq('id', weekId)
        .single();

      if (week) {
        setWeekTitle(week.title);
        setWeekNumber(week.week_number);
      }

      // Fetch test
      const { data: test } = await (supabase
        .from('weekly_tests' as any) as any)
        .select('*')
        .eq('week_id', weekId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (test) {
        setTestId(test.id);
        setQuestions((test.questions as any) || []);
        setPassThreshold(test.pass_threshold);
      }

      // Fetch previous attempts
      const { data: attempts } = await (supabase
        .from('test_attempts' as any) as any)
        .select('*')
        .eq('week_id', weekId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPreviousAttempts(attempts || []);

      // Fetch AI feedback
      const { data: feedback } = await (supabase
        .from('ai_feedback' as any) as any)
        .select('*')
        .eq('week_id', weekId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (feedback) {
        setAiFeedback(feedback.feedback);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async () => {
    if (!user || !testId || !weekId) return;

    // Validate all questions answered
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      // Calculate score
      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.correctIndex) correct++;
      });
      const testScore = Math.round((correct / questions.length) * 100);
      const testPassed = testScore >= passThreshold;

      setScore(testScore);
      setPassed(testPassed);
      setSubmitted(true);

      // Save attempt
      await (supabase.from('test_attempts' as any) as any).insert({
        user_id: user.id,
        week_id: weekId,
        test_id: testId,
        answers,
        score: testScore,
        passed: testPassed,
      });

      if (testPassed) {
        // Mark week as completed
        await (supabase
          .from('roadmap_weeks') as any)
          .update({ status: 'completed' })
          .eq('id', weekId);

        // Unlock next week
        const { data: currentWeek } = await supabase
          .from('roadmap_weeks')
          .select('roadmap_id, week_number')
          .eq('id', weekId)
          .single();

        if (currentWeek) {
          await (supabase
            .from('roadmap_weeks') as any)
            .update({ status: 'active' })
            .eq('roadmap_id', currentWeek.roadmap_id)
            .eq('week_number', currentWeek.week_number + 1)
            .eq('status', 'locked');
        }

        toast.success(`Congratulations! You passed with ${testScore}%! 🎉`);
      } else {
        // Mark week as extended
        await (supabase
          .from('roadmap_weeks') as any)
          .update({ status: 'extended' })
          .eq('id', weekId);

        toast.error(`Score: ${testScore}%. You need ${passThreshold}% to pass. Review and try again.`);
      }

      // Request AI feedback
      fetchAIFeedback(testScore, testPassed, correct, questions.length);
    } catch (error) {
      toast.error('Failed to submit test.');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAIFeedback = async (testScore: number, testPassed: boolean, correct: number, total: number) => {
    if (!user || !weekId) return;
    setLoadingFeedback(true);

    try {
      const response = await supabase.functions.invoke('weekly-feedback', {
        body: {
          weekId,
          weekTitle,
          weekNumber,
          testScore,
          testPassed,
          correctAnswers: correct,
          totalQuestions: total,
        },
      });

      if (response.data?.feedback) {
        setAiFeedback(response.data.feedback);

        // Save feedback
        await (supabase.from('ai_feedback' as any) as any).insert({
          user_id: user.id,
          week_id: weekId,
          feedback: response.data.feedback,
          weak_areas: response.data.weakAreas || null,
          focus_topics: response.data.focusTopics || null,
          feedback_type: 'weekly',
        });
      }
    } catch (error) {
      console.error('AI feedback error:', error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setPassed(false);
  };

  const hasPreviouslyPassed = previousAttempts.some(a => a.passed);

  if (loading) {
    return (
      <DashboardLayout title="Weekly Test">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${weekTitle} - Test`}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                  <Trophy className="w-7 h-7 text-primary" />
                  Weekly Test: {weekTitle}
                </h2>
                <p className="text-muted-foreground mt-1">
                  Pass threshold: {passThreshold}% • {questions.length} questions
                  {previousAttempts.length > 0 && ` • ${previousAttempts.length} previous attempt(s)`}
                </p>
              </div>
              {hasPreviouslyPassed && (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Passed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Card (shown after submit) */}
        {submitted && (
          <Card className={cn(
            'border-2',
            passed ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'
          )}>
            <CardContent className="p-6 text-center">
              <div className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
                passed ? 'bg-success/20' : 'bg-destructive/20'
              )}>
                {passed ? (
                  <CheckCircle2 className="w-10 h-10 text-success" />
                ) : (
                  <XCircle className="w-10 h-10 text-destructive" />
                )}
              </div>
              <h3 className="text-2xl font-bold">{score}%</h3>
              <p className={cn('text-lg font-medium mt-1', passed ? 'text-success' : 'text-destructive')}>
                {passed ? 'You Passed!' : 'Not Passed'}
              </p>
              <p className="text-muted-foreground mt-2">
                {passed
                  ? 'Great job! The next week has been unlocked.'
                  : `You need ${passThreshold}% to pass. Review the concepts and try again.`}
              </p>
              <div className="flex justify-center gap-3 mt-6">
                {passed ? (
                  <Button onClick={() => navigate('/courses')} className="gradient-primary">
                    Continue to Courses
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => navigate(`/learn/${weekId}`)} variant="outline">
                      Review Concepts
                    </Button>
                    <Button onClick={handleRetake}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake Test
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Feedback */}
        {(aiFeedback || loadingFeedback) && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Mentor Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFeedback ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating personalized feedback...
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {aiFeedback}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Questions */}
        {!submitted && questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((q, qIndex) => (
              <Card key={qIndex} className={cn(answers[qIndex] !== undefined && 'border-primary/30')}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      {qIndex + 1}
                    </span>
                    {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[qIndex]?.toString()}
                    onValueChange={val => setAnswers(prev => ({ ...prev, [qIndex]: parseInt(val) }))}
                  >
                    {q.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all',
                          answers[qIndex] === oIndex
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => setAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                      >
                        <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                        <Label htmlFor={`q${qIndex}-o${oIndex}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {Object.keys(answers).length}/{questions.length} answered
              </p>
              <Button
                onClick={handleSubmitTest}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className="gradient-primary"
                size="lg"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trophy className="w-4 h-4 mr-2" />
                )}
                Submit Test
              </Button>
            </div>
          </div>
        )}

        {/* Show answers review after submission */}
        {submitted && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Answer Review</h3>
            {questions.map((q, qIndex) => {
              const userAnswer = answers[qIndex];
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <Card key={qIndex} className={cn(
                  'border-l-4',
                  isCorrect ? 'border-l-success' : 'border-l-destructive'
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{q.question}</p>
                        <p className="text-sm mt-1">
                          Your answer: <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                            {q.options[userAnswer]}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-success mt-1">
                            Correct answer: {q.options[q.correctIndex]}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
