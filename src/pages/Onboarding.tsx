import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, ArrowLeft, Briefcase, Clock, Brain, Target } from 'lucide-react';
import { toast } from 'sonner';

const careerRoles = [
  { id: 'frontend', name: 'Frontend Developer', icon: '💻' },
  { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
  { id: 'fullstack', name: 'Full Stack Developer', icon: '🚀' },
  { id: 'data-science', name: 'Data Scientist', icon: '📊' },
  { id: 'ml-engineer', name: 'ML Engineer', icon: '🤖' },
  { id: 'devops', name: 'DevOps Engineer', icon: '🔧' },
  { id: 'mobile', name: 'Mobile Developer', icon: '📱' },
  { id: 'cloud', name: 'Cloud Architect', icon: '☁️' },
];

const weeklyHoursOptions = [
  { id: '5', label: '5 hours', description: 'Casual pace' },
  { id: '10', label: '10 hours', description: 'Moderate pace' },
  { id: '15', label: '15 hours', description: 'Intensive pace' },
  { id: '20', label: '20+ hours', description: 'Full commitment' },
];

const experienceLevels = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate', description: '1-3 years experience' },
  { id: 'advanced', label: 'Advanced', description: '3+ years experience' },
];

const quizQuestions = [
  {
    id: 'q1',
    question: 'How comfortable are you with programming fundamentals?',
    options: [
      { value: '1', label: 'No experience' },
      { value: '2', label: 'Some basics' },
      { value: '3', label: 'Comfortable' },
      { value: '4', label: 'Very confident' },
    ],
  },
  {
    id: 'q2',
    question: 'Have you built any projects before?',
    options: [
      { value: '1', label: 'No projects yet' },
      { value: '2', label: 'Followed tutorials' },
      { value: '3', label: 'Built small projects' },
      { value: '4', label: 'Built production apps' },
    ],
  },
  {
    id: 'q3',
    question: 'What is your preferred learning style?',
    options: [
      { value: 'video', label: 'Video tutorials' },
      { value: 'reading', label: 'Reading docs' },
      { value: 'hands-on', label: 'Hands-on practice' },
      { value: 'mixed', label: 'Mixed approach' },
    ],
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('10');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1 && !targetRole) {
      toast.error('Please select a career goal');
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Save user goals
      const { error: goalsError } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          target_role: targetRole,
          weekly_hours: parseInt(weeklyHours),
          experience_level: experienceLevel,
        });

      if (goalsError) throw goalsError;

      // Save assessment answers
      const { error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'initial_quiz',
          answers: quizAnswers,
          score: calculateScore(),
          completed_at: new Date().toISOString(),
        });

      if (assessmentError) throw assessmentError;

      // Create initial roadmap
      const { error: roadmapError } = await supabase
        .from('roadmaps')
        .insert({
          user_id: user.id,
          title: `${careerRoles.find(r => r.id === targetRole)?.name} Learning Path`,
          description: `Personalized learning path to become a ${careerRoles.find(r => r.id === targetRole)?.name}`,
          duration_weeks: 6,
          start_date: new Date().toISOString().split('T')[0],
          status: 'active',
        });

      if (roadmapError) throw roadmapError;

      toast.success('Setup complete! Generating your personalized roadmap...');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save your preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScore = () => {
    const numericAnswers = Object.values(quizAnswers).filter(v => !isNaN(parseInt(v)));
    if (numericAnswers.length === 0) return 50;
    const total = numericAnswers.reduce((sum, v) => sum + parseInt(v), 0);
    return Math.round((total / (numericAnswers.length * 4)) * 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold">SkillPath</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </div>
        </div>
        <Progress value={progress} className="h-1" />
      </header>

      {/* Content */}
      <main className="flex-1 container max-w-4xl mx-auto py-12 px-6">
        {/* Step 1: Career Goal */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">What's your career goal?</h1>
              <p className="text-muted-foreground">
                Select the role you want to work towards. We'll create a personalized learning path for you.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {careerRoles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    targetRole === role.id
                      ? 'ring-2 ring-primary shadow-glow'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setTargetRole(role.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{role.icon}</div>
                    <p className="font-medium text-sm">{role.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time Commitment */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">How much time can you commit?</h1>
              <p className="text-muted-foreground">
                This helps us pace your learning journey appropriately.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Weekly learning hours</Label>
                <RadioGroup value={weeklyHours} onValueChange={setWeeklyHours}>
                  {weeklyHoursOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        weeklyHours === option.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setWeeklyHours(option.id)}
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-muted-foreground ml-2">— {option.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Experience level</Label>
                <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
                  {experienceLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        experienceLevel === level.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setExperienceLevel(level.id)}
                    >
                      <RadioGroupItem value={level.id} id={level.id} />
                      <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                        <span className="font-medium">{level.label}</span>
                        <span className="text-muted-foreground ml-2">— {level.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Skill Assessment */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">Quick skill assessment</h1>
              <p className="text-muted-foreground">
                Answer a few questions so we can personalize your learning path.
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-8">
              {quizQuestions.map((q, index) => (
                <Card key={q.id} className="p-6">
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                    <h3 className="text-lg font-medium mt-1">{q.question}</h3>
                  </div>
                  <RadioGroup
                    value={quizAnswers[q.id] || ''}
                    onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [q.id]: value })}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                            quizAnswers[q.id] === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: option.value })}
                        >
                          <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} />
                          <Label htmlFor={`${q.id}-${option.value}`} className="cursor-pointer text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">Ready to start your journey!</h1>
              <p className="text-muted-foreground">
                Here's a summary of your learning profile.
              </p>
            </div>

            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <CardTitle>Your Learning Profile</CardTitle>
                <CardDescription>We'll use this to create your personalized roadmap</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Career Goal</span>
                  <span className="font-medium">
                    {careerRoles.find(r => r.id === targetRole)?.icon}{' '}
                    {careerRoles.find(r => r.id === targetRole)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Weekly Commitment</span>
                  <span className="font-medium">{weeklyHours} hours</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Experience Level</span>
                  <span className="font-medium capitalize">{experienceLevel}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Assessment Score</span>
                  <span className="font-medium">{calculateScore()}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-border bg-card">
        <div className="container max-w-4xl mx-auto py-4 px-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext} className="gradient-primary">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating your roadmap...' : 'Start Learning'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
