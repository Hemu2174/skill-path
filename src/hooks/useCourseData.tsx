import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WeekWithProgress {
  id: string;
  week_number: number;
  title: string;
  description: string | null;
  status: string;
  roadmap_id: string;
  totalConcepts: number;
  completedConcepts: number;
  testPassed: boolean;
  testScore: number | null;
}

interface CourseData {
  roadmapId: string | null;
  roadmapTitle: string;
  roadmapDescription: string | null;
  weeks: WeekWithProgress[];
  overallProgress: number;
  started: boolean;
  loading: boolean;
  currentWeekNumber: number;
  allWeeksCompleted: boolean;
  refreshData: () => Promise<void>;
}

export function useCourseData(): CourseData {
  const { user } = useAuth();
  const [data, setData] = useState<Omit<CourseData, 'refreshData'>>({
    roadmapId: null,
    roadmapTitle: '',
    roadmapDescription: null,
    weeks: [],
    overallProgress: 0,
    started: false,
    loading: true,
    currentWeekNumber: 0,
    allWeeksCompleted: false,
  });

  const fetchData = useCallback(async () => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      // Fetch roadmap
      const { data: roadmap } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!roadmap) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      // Fetch weeks
      const { data: weeks } = await supabase
        .from('roadmap_weeks')
        .select('*')
        .eq('roadmap_id', roadmap.id)
        .order('week_number', { ascending: true });

      if (!weeks || weeks.length === 0) {
        setData(prev => ({ ...prev, roadmapId: roadmap.id, roadmapTitle: roadmap.title, loading: false }));
        return;
      }

      const weekIds = weeks.map(w => w.id);

      // Fetch concepts and progress in parallel
      const [conceptsRes, progressRes, attemptsRes] = await Promise.all([
        (supabase.from('concepts' as any) as any).select('id, week_id').eq('user_id', user.id),
        (supabase.from('concept_progress' as any) as any).select('concept_id, is_completed').eq('user_id', user.id),
        (supabase.from('test_attempts' as any) as any).select('week_id, passed, score').eq('user_id', user.id),
      ]);

      const concepts = conceptsRes.data || [];
      const progress = progressRes.data || [];
      const attempts = attemptsRes.data || [];

      const completedSet = new Set(progress.filter(p => p.is_completed).map(p => p.concept_id));

      // Best test attempt per week
      const bestAttempts: Record<string, { passed: boolean; score: number }> = {};
      attempts.forEach(a => {
        if (!bestAttempts[a.week_id] || a.score > bestAttempts[a.week_id].score) {
          bestAttempts[a.week_id] = { passed: a.passed, score: a.score };
        }
      });

      const weeksWithProgress: WeekWithProgress[] = weeks.map(w => {
        const weekConcepts = concepts.filter(c => c.week_id === w.id);
        const completedConcepts = weekConcepts.filter(c => completedSet.has(c.id)).length;
        const attempt = bestAttempts[w.id];
        return {
          id: w.id,
          week_number: w.week_number,
          title: w.title,
          description: w.description,
          status: (w as any).status || 'locked',
          roadmap_id: w.roadmap_id,
          totalConcepts: weekConcepts.length,
          completedConcepts,
          testPassed: attempt?.passed || false,
          testScore: attempt?.score ?? null,
        };
      });

      // Calculate overall progress from concepts + tests
      const totalConcepts = concepts.length;
      const totalCompleted = completedSet.size;
      const totalWeeks = weeks.length;
      const passedTests = Object.values(bestAttempts).filter(a => a.passed).length;
      // Progress = 70% concepts + 30% tests
      const conceptProgress = totalConcepts > 0 ? (totalCompleted / totalConcepts) * 70 : 0;
      const testProgress = totalWeeks > 0 ? (passedTests / totalWeeks) * 30 : 0;
      const overallProgress = Math.round(conceptProgress + testProgress);

      const hasActiveWeek = weeksWithProgress.some(w => w.status === 'active' || w.status === 'completed' || w.status === 'extended');
      const currentWeek = weeksWithProgress.find(w => w.status === 'active' || w.status === 'extended');
      const allWeeksCompleted = weeksWithProgress.every(w => w.status === 'completed');

      setData({
        roadmapId: roadmap.id,
        roadmapTitle: roadmap.title,
        roadmapDescription: roadmap.description,
        weeks: weeksWithProgress,
        overallProgress,
        started: hasActiveWeek,
        loading: false,
        currentWeekNumber: currentWeek?.week_number || 0,
        allWeeksCompleted,
      });
    } catch (error) {
      console.error('Error fetching course data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, refreshData: fetchData };
}
