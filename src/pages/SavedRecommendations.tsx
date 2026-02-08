import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, Trash2, Loader2 } from 'lucide-react';

interface SavedRec {
  id: string;
  content: string;
  created_at: string;
}

export default function SavedRecommendations() {
  const { user } = useAuth();
  const [recs, setRecs] = useState<SavedRec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchRecs();
  }, [user]);

  const fetchRecs = async () => {
    const { data } = await supabase
      .from('saved_recommendations')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setRecs(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('saved_recommendations')
      .delete()
      .eq('id', id);
    if (error) {
      toast.error('Failed to delete');
      return;
    }
    setRecs(prev => prev.filter(r => r.id !== id));
    toast.success('Recommendation deleted');
  };

  return (
    <DashboardLayout title="Saved Recommendations">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            Saved AI Recommendations
          </h2>
          <p className="text-muted-foreground mt-1">
            Review your previously saved AI mentor insights
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : recs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No saved recommendations</h3>
              <p className="text-muted-foreground">
                Use the AI Mentor on your dashboard or weekly check-in to get recommendations, then save them here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recs.map((rec) => (
              <Card key={rec.id} className="border-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {new Date(rec.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rec.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                    {rec.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
