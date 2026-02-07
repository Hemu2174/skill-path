import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SkillProgress {
  skill: string;
  level: number;
  tasksCompleted: number;
  totalTasks: number;
}

export function useSkillsProgress() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchSkills();
  }, [user]);

  const fetchSkills = async () => {
    if (!user) return;

    try {
      // Get all tasks grouped by week with their roadmap week info
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*, roadmap_weeks:week_id(title, week_number)')
        .eq('user_id', user.id);

      if (!tasks || tasks.length === 0) {
        setSkills([]);
        setLoading(false);
        return;
      }

      // Group tasks by task_type to derive skill areas
      const typeMap: Record<string, { completed: number; total: number }> = {};
      tasks.forEach((task) => {
        const type = task.task_type || 'lesson';
        if (!typeMap[type]) typeMap[type] = { completed: 0, total: 0 };
        typeMap[type].total++;
        if (task.is_completed) typeMap[type].completed++;
      });

      // Also group by week to get per-week progress as "skills"
      const weekMap: Record<string, { title: string; completed: number; total: number; weekNum: number }> = {};
      tasks.forEach((task) => {
        const weekInfo = task.roadmap_weeks as any;
        const weekId = task.week_id;
        if (!weekMap[weekId]) {
          weekMap[weekId] = {
            title: weekInfo?.title?.replace(/^Week \d+:\s*/, '') || `Week ${weekInfo?.week_number || '?'}`,
            completed: 0,
            total: 0,
            weekNum: weekInfo?.week_number || 0,
          };
        }
        weekMap[weekId].total++;
        if (task.is_completed) weekMap[weekId].completed++;
      });

      const weekSkills = Object.values(weekMap)
        .sort((a, b) => a.weekNum - b.weekNum)
        .map((w) => ({
          skill: w.title,
          level: w.total > 0 ? Math.round((w.completed / w.total) * 100) : 0,
          tasksCompleted: w.completed,
          totalTasks: w.total,
        }));

      setSkills(weekSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  return { skills, loading, refetch: fetchSkills };
}
