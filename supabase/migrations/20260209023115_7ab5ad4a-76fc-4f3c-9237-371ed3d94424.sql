
-- Add status column to roadmap_weeks
ALTER TABLE public.roadmap_weeks ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'locked';

-- Concepts within each week
CREATE TABLE public.concepts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id UUID NOT NULL REFERENCES public.roadmap_weeks(id),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_required_seconds INTEGER NOT NULL DEFAULT 120,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own concepts" ON public.concepts FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own concepts" ON public.concepts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own concepts" ON public.concepts FOR UPDATE
  USING (auth.uid() = user_id);

-- Track concept progress per user
CREATE TABLE public.concept_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  concept_id UUID NOT NULL REFERENCES public.concepts(id),
  video_watch_seconds INTEGER NOT NULL DEFAULT 0,
  video_completed BOOLEAN NOT NULL DEFAULT false,
  practice_completed BOOLEAN NOT NULL DEFAULT false,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, concept_id)
);

ALTER TABLE public.concept_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own concept progress" ON public.concept_progress FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own concept progress" ON public.concept_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own concept progress" ON public.concept_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Weekly test definitions
CREATE TABLE public.weekly_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id UUID NOT NULL REFERENCES public.roadmap_weeks(id),
  user_id UUID NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  pass_threshold INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.weekly_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weekly tests" ON public.weekly_tests FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weekly tests" ON public.weekly_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User test attempts
CREATE TABLE public.test_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_id UUID NOT NULL REFERENCES public.roadmap_weeks(id),
  test_id UUID NOT NULL REFERENCES public.weekly_tests(id),
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own test attempts" ON public.test_attempts FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own test attempts" ON public.test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- AI feedback after weekly/final tests
CREATE TABLE public.ai_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_id UUID REFERENCES public.roadmap_weeks(id),
  feedback TEXT NOT NULL,
  weak_areas JSONB,
  focus_topics JSONB,
  feedback_type TEXT NOT NULL DEFAULT 'weekly',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ai feedback" ON public.ai_feedback FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ai feedback" ON public.ai_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for concept_progress and test_attempts
ALTER PUBLICATION supabase_realtime ADD TABLE public.concept_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_attempts;

-- Trigger for updated_at on concept_progress
CREATE TRIGGER update_concept_progress_updated_at
  BEFORE UPDATE ON public.concept_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
