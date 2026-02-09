import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useCourseData } from '@/hooks/useCourseData';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Award,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Lock,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FinalAssessment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { allWeeksCompleted, loading: courseLoading } = useCourseData();

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [masteryLevel, setMasteryLevel] = useState('');

  useEffect(() => {
    if (!user || courseLoading) return;
    if (!allWeeksCompleted) {
      setLoading(false);
      return;
    }
    fetchFinalQuestions();
  }, [user, allWeeksCompleted, courseLoading]);

  const fetchFinalQuestions = async () => {
    if (!user) return;
    try {
      // Gather all test questions across all weeks
      const { data: tests } = await (supabase
        .from('weekly_tests' as any) as any)
        .select('questions')
        .eq('user_id', user.id);

      const allQuestions: any[] = [];
      (tests || []).forEach(t => {
        const qs = (t.questions as any[]) || [];
        qs.forEach(q => allQuestions.push(q));
      });

      // Shuffle and pick 20 (or all if fewer)
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, Math.min(20, shuffled.length)));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions.');
      return;
    }

    setSubmitting(true);
    try {
      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.correctIndex) correct++;
      });
      const finalScore = Math.round((correct / questions.length) * 100);
      setScore(finalScore);
      setSubmitted(true);

      // Determine mastery level
      let level = 'Beginner';
      if (finalScore >= 90) level = 'Advanced';
      else if (finalScore >= 70) level = 'Intermediate';
      setMasteryLevel(level);

      toast.success(`Final Score: ${finalScore}%`);

      // Request AI final report
      fetchFinalReport(finalScore, correct, questions.length, level);
    } catch (error) {
      toast.error('Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchFinalReport = async (finalScore: number, correct: number, total: number, level: string) => {
    if (!user) return;
    setLoadingFeedback(true);
    try {
      const response = await supabase.functions.invoke('weekly-feedback', {
        body: {
          weekId: null,
          weekTitle: 'Final Grand Assessment',
          weekNumber: 0,
          testScore: finalScore,
          testPassed: true,
          correctAnswers: correct,
          totalQuestions: total,
          isFinal: true,
          masteryLevel: level,
        },
      });

      if (response.data?.feedback) {
        setAiFeedback(response.data.feedback);

        await (supabase.from('ai_feedback' as any) as any).insert({
          user_id: user.id,
          week_id: null,
          feedback: response.data.feedback,
          feedback_type: 'final',
        });
      }
    } catch (error) {
      console.error('AI feedback error:', error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  if (loading || courseLoading) {
    return (
      <DashboardLayout title="Final Assessment">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!allWeeksCompleted) {
    return (
      <DashboardLayout title="Final Assessment">
        <Card className="max-w-lg mx-auto text-center py-12">
          <CardContent>
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Assessment Locked</h2>
            <p className="text-muted-foreground mb-4">
              Complete all weeks and pass all weekly tests to unlock the final assessment.
            </p>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Final Grand Assessment">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="gradient-primary text-white">
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-2xl font-display font-bold">Final Grand Assessment</h2>
            <p className="opacity-80 mt-1">
              {questions.length} questions covering the entire course • Demonstrate your mastery
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        {submitted && (
          <Card className="border-2 border-primary">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-4xl font-bold">{score}%</h3>
              <Badge className={cn(
                'mt-3 text-base px-4 py-1',
                masteryLevel === 'Advanced' ? 'bg-success' :
                masteryLevel === 'Intermediate' ? 'bg-primary' :
                'bg-warning'
              )}>
                {masteryLevel} Level
              </Badge>
              <p className="text-muted-foreground mt-4">
                {masteryLevel === 'Advanced' 
                  ? 'Outstanding! You have mastered the course content.'
                  : masteryLevel === 'Intermediate'
                  ? 'Great work! You have a solid understanding of the material.'
                  : 'Good start! Continue practicing to strengthen your skills.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Report */}
        {(aiFeedback || loadingFeedback) && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Final Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFeedback ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating your comprehensive report...
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
        {!submitted && (
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
                    {q.options.map((option: string, oIndex: number) => (
                      <div
                        key={oIndex}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all',
                          answers[qIndex] === oIndex ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => setAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                      >
                        <RadioGroupItem value={oIndex.toString()} id={`fq${qIndex}-o${oIndex}`} />
                        <Label htmlFor={`fq${qIndex}-o${oIndex}`} className="flex-1 cursor-pointer">{option}</Label>
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
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className="gradient-primary"
                size="lg"
              >
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Award className="w-4 h-4 mr-2" />}
                Submit Final Assessment
              </Button>
            </div>
          </div>
        )}

        {/* Answer review */}
        {submitted && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Answer Review</h3>
            {questions.map((q, qIndex) => {
              const userAnswer = answers[qIndex];
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <Card key={qIndex} className={cn('border-l-4', isCorrect ? 'border-l-success' : 'border-l-destructive')}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-medium">{q.question}</p>
                        <p className="text-sm mt-1">Your answer: <span className={isCorrect ? 'text-success' : 'text-destructive'}>{q.options[userAnswer]}</span></p>
                        {!isCorrect && <p className="text-sm text-success mt-1">Correct: {q.options[q.correctIndex]}</p>}
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
