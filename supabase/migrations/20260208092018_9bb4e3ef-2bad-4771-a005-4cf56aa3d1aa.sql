
CREATE TABLE public.saved_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recommendations"
  ON public.saved_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
  ON public.saved_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations"
  ON public.saved_recommendations FOR DELETE
  USING (auth.uid() = user_id);
