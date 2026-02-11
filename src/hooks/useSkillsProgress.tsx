import { useState, useEffect } from 'react';
import { useCourseData } from '@/hooks/useCourseData';

interface SkillProgress {
  skill: string;
  level: number;
  tasksCompleted: number;
  totalTasks: number;
}

export function useSkillsProgress() {
  const { weeks, loading: courseLoading } = useCourseData();
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseLoading) return;

    const weekSkills = weeks.map(w => ({
      skill: w.title.replace(/^Week \d+:\s*/, ''),
      level: w.totalConcepts > 0 ? Math.round((w.completedConcepts / w.totalConcepts) * 100) : 0,
      tasksCompleted: w.completedConcepts,
      totalTasks: w.totalConcepts,
    }));

    setSkills(weekSkills);
    setLoading(false);
  }, [weeks, courseLoading]);

  return { skills, loading, refetch: () => {} };
}
