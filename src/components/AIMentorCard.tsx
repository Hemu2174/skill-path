import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, RefreshCw, Bookmark, Check } from 'lucide-react';
import { useAIMentor } from '@/hooks/useAIMentor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AIMentorCardProps {
  compact?: boolean;
}

export function AIMentorCard({ compact = false }: AIMentorCardProps) {
  const { response, loading, fetchRecommendations } = useAIMentor();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Reset saved state when response changes
  useEffect(() => { setSaved(false); }, [response]);

  const handleSave = async () => {
    if (!user || !response) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('saved_recommendations')
        .insert({ user_id: user.id, content: response });
      if (error) throw error;
      setSaved(true);
      toast.success('Recommendation saved!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className={compact ? 'pb-2' : undefined}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className={compact ? 'text-base' : undefined}>AI Mentor</CardTitle>
              {!compact && (
                <CardDescription>Personalized learning recommendations</CardDescription>
              )}
            </div>
          </div>
          <Badge variant="secondary">AI-Powered</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {response ? (
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRecommendations}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Insights
              </Button>
              <Button
                variant={saved ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleSave}
                disabled={saving || saved || loading}
              >
                {saved ? (
                  <><Check className="w-4 h-4 mr-2" />Saved</>
                ) : saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Bookmark className="w-4 h-4 mr-2" />Save</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {compact
                ? 'Get AI-powered learning insights'
                : 'Analyze your progress and get personalized skill insights, topic recommendations, and project ideas.'}
            </p>
            <Button
              onClick={fetchRecommendations}
              disabled={loading}
              className="gradient-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
