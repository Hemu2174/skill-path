import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TaskCompletionData {
  date: string;
  completed: number;
  total: number;
}

interface ProgressStats {
  totalTasks: number;
  completedTasks: number;
  hoursSpent: number;
  currentStreak: number;
}

export function useProgressData() {
  const { user } = useAuth();
  const [taskCompletionData, setTaskCompletionData] = useState<TaskCompletionData[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalTasks: 0,
    completedTasks: 0,
    hoursSpent: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProgressData = async () => {
      try {
        // Fetch all tasks for the user
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('*, roadmap_weeks!inner(roadmap_id, week_number)')
          .eq('user_id', user.id);

        if (tasksError) throw tasksError;

        // Calculate stats
        const totalTasks = tasks?.length || 0;
        const completedTasks = tasks?.filter(t => t.is_completed)?.length || 0;
        const totalMinutes = tasks?.reduce((acc, t) => acc + (t.is_completed ? (t.duration_minutes || 30) : 0), 0) || 0;
        const hoursSpent = Math.round(totalMinutes / 60 * 10) / 10;

        // Calculate streak (consecutive days with completed tasks)
        const completedDates = tasks
          ?.filter(t => t.completed_at)
          .map(t => new Date(t.completed_at!).toDateString())
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        let streak = 0;
        if (completedDates && completedDates.length > 0) {
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          
          if (completedDates[0] === today || completedDates[0] === yesterday) {
            streak = 1;
            for (let i = 1; i < completedDates.length; i++) {
              const prevDate = new Date(completedDates[i - 1]);
              const currDate = new Date(completedDates[i]);
              const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
              
              if (diffDays === 1) {
                streak++;
              } else {
                break;
              }
            }
          }
        }

        setStats({
          totalTasks,
          completedTasks,
          hoursSpent,
          currentStreak: streak,
        });

        // Generate weekly completion data for chart
        const weeklyData: Record<string, { completed: number; total: number }> = {};
        
        // Get last 6 weeks
        for (let i = 5; i >= 0; i--) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (i * 7));
          const weekLabel = `Week ${6 - i}`;
          weeklyData[weekLabel] = { completed: 0, total: 0 };
        }

        // Group tasks by week
        tasks?.forEach(task => {
          const weekNum = (task.roadmap_weeks as any)?.week_number || 1;
          const weekLabel = `Week ${Math.min(weekNum, 6)}`;
          if (weeklyData[weekLabel]) {
            weeklyData[weekLabel].total++;
            if (task.is_completed) {
              weeklyData[weekLabel].completed++;
            }
          }
        });

        const chartData = Object.entries(weeklyData).map(([date, data]) => ({
          date,
          completed: data.completed,
          total: data.total,
        }));

        setTaskCompletionData(chartData);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('progress-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchProgressData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { taskCompletionData, stats, loading };
}
