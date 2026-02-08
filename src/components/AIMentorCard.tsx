import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useAIMentor } from '@/hooks/useAIMentor';

interface AIMentorCardProps {
  compact?: boolean;
}

export function AIMentorCard({ compact = false }: AIMentorCardProps) {
  const { response, loading, fetchRecommendations } = useAIMentor();

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
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecommendations}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Insights
            </Button>
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
