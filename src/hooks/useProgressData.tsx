import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCourseData } from '@/hooks/useCourseData';

interface WeekCompletionData {
  date: string;
  completed: number;
  total: number;
}

interface ProgressStats {
  totalConcepts: number;
  completedConcepts: number;
  hoursSpent: number;
  currentStreak: number;
  testsPassed: number;
  totalTests: number;
}

export function useProgressData() {
  const { user } = useAuth();
  const { weeks } = useCourseData();
  const [taskCompletionData, setTaskCompletionData] = useState<WeekCompletionData[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalConcepts: 0,
    completedConcepts: 0,
    hoursSpent: 0,
    currentStreak: 0,
    testsPassed: 0,
    totalTests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProgressData = async () => {
      try {
        // Fetch concept progress for hours & streak
        const { data: conceptProgress } = await (supabase
          .from('concept_progress' as any) as any)
          .select('video_watch_seconds, is_completed, completed_at')
          .eq('user_id', user.id);

        const progress = conceptProgress || [];

        // Total watch time in hours
        const totalSeconds = progress.reduce((acc: number, p: any) => acc + (p.video_watch_seconds || 0), 0);
        // Add ~15 min per completed practice
        const practiceMinutes = progress.filter((p: any) => p.is_completed).length * 15;
        const hoursSpent = Math.round(((totalSeconds / 3600) + (practiceMinutes / 60)) * 10) / 10;

        // Streak from completed_at dates
        const completedDates = progress
          .filter((p: any) => p.completed_at)
          .map((p: any) => new Date(p.completed_at).toDateString())
          .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
          .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());

        let streak = 0;
        if (completedDates.length > 0) {
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          if (completedDates[0] === today || completedDates[0] === yesterday) {
            streak = 1;
            for (let i = 1; i < completedDates.length; i++) {
              const prev = new Date(completedDates[i - 1]);
              const curr = new Date(completedDates[i]);
              if (Math.round((prev.getTime() - curr.getTime()) / 86400000) === 1) {
                streak++;
              } else break;
            }
          }
        }

        // Derive totals from useCourseData weeks
        const totalConcepts = weeks.reduce((a, w) => a + w.totalConcepts, 0);
        const completedConcepts = weeks.reduce((a, w) => a + w.completedConcepts, 0);
        const testsPassed = weeks.filter(w => w.testPassed).length;

        setStats({
          totalConcepts,
          completedConcepts,
          hoursSpent,
          currentStreak: streak,
          testsPassed,
          totalTests: weeks.length,
        });

        // Chart data per week
        const chartData = weeks.map(w => ({
          date: `Week ${w.week_number}`,
          completed: w.completedConcepts,
          total: w.totalConcepts,
        }));
        setTaskCompletionData(chartData);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user, weeks]);

  return { taskCompletionData, stats, loading };
}
