import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  Star, 
  ArrowRight, 
  BookOpen, 
  Code, 
  Briefcase, 
  Loader2,
  Trophy,
  Sparkles,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdvancedPath {
  id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: string;
  estimatedWeeks: number;
  icon: React.ReactNode;
}

const advancedPathsByRole: Record<string, AdvancedPath[]> = {
  frontend: [
    { id: 'advanced-react', title: 'Advanced React Patterns', description: 'Master render props, compound components, state machines, and performance optimization.', topics: ['Server Components', 'Suspense', 'Concurrent Features', 'Custom Hooks'], difficulty: 'Advanced', estimatedWeeks: 6, icon: <Code className="w-6 h-6" /> },
    { id: 'design-systems', title: 'Design Systems Engineering', description: 'Build scalable, accessible component libraries with tokens and theming.', topics: ['Design Tokens', 'Accessibility (a11y)', 'Storybook', 'Component APIs'], difficulty: 'Advanced', estimatedWeeks: 8, icon: <Star className="w-6 h-6" /> },
    { id: 'web-perf', title: 'Web Performance Mastery', description: 'Optimize Core Web Vitals, bundle sizes, and rendering performance.', topics: ['Lighthouse', 'Code Splitting', 'Image Optimization', 'Service Workers'], difficulty: 'Intermediate', estimatedWeeks: 4, icon: <Zap className="w-6 h-6" /> },
  ],
  backend: [
    { id: 'system-design', title: 'System Design & Architecture', description: 'Design scalable distributed systems, microservices, and event-driven architectures.', topics: ['Microservices', 'Event Sourcing', 'CQRS', 'Load Balancing'], difficulty: 'Advanced', estimatedWeeks: 8, icon: <Code className="w-6 h-6" /> },
    { id: 'devops-backend', title: 'DevOps for Backend Engineers', description: 'Master CI/CD, containerization, and infrastructure as code.', topics: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'], difficulty: 'Intermediate', estimatedWeeks: 6, icon: <Briefcase className="w-6 h-6" /> },
    { id: 'api-design', title: 'Advanced API Design', description: 'Build production-grade APIs with GraphQL, gRPC, and REST best practices.', topics: ['GraphQL', 'gRPC', 'Rate Limiting', 'API Versioning'], difficulty: 'Advanced', estimatedWeeks: 5, icon: <Zap className="w-6 h-6" /> },
  ],
  fullstack: [
    { id: 'cloud-native', title: 'Cloud-Native Development', description: 'Build and deploy cloud-native full-stack applications at scale.', topics: ['Serverless', 'Edge Computing', 'CDN Strategy', 'Multi-Region'], difficulty: 'Advanced', estimatedWeeks: 8, icon: <Code className="w-6 h-6" /> },
    { id: 'realtime-apps', title: 'Real-Time Applications', description: 'Build collaborative, real-time apps with WebSockets and CRDTs.', topics: ['WebSockets', 'CRDTs', 'Operational Transform', 'Presence'], difficulty: 'Advanced', estimatedWeeks: 6, icon: <Zap className="w-6 h-6" /> },
    { id: 'testing-mastery', title: 'Testing Mastery', description: 'Implement comprehensive testing strategies across the full stack.', topics: ['E2E Testing', 'Visual Regression', 'Load Testing', 'Contract Testing'], difficulty: 'Intermediate', estimatedWeeks: 5, icon: <Star className="w-6 h-6" /> },
  ],
};

// Default paths for roles without specific ones
const defaultPaths: AdvancedPath[] = [
  { id: 'leadership', title: 'Technical Leadership', description: 'Develop skills for leading engineering teams and driving technical strategy.', topics: ['Code Reviews', 'Architecture Decisions', 'Mentoring', 'Technical Writing'], difficulty: 'Advanced', estimatedWeeks: 8, icon: <Briefcase className="w-6 h-6" /> },
  { id: 'open-source', title: 'Open Source Contribution', description: 'Learn to contribute to and maintain open source projects effectively.', topics: ['Git Workflows', 'Documentation', 'Community Building', 'CI/CD'], difficulty: 'Intermediate', estimatedWeeks: 4, icon: <BookOpen className="w-6 h-6" /> },
  { id: 'specialization', title: 'Deep Specialization', description: 'Go deeper into your chosen domain with advanced research and projects.', topics: ['Research Papers', 'Benchmarking', 'Conference Talks', 'Portfolio Projects'], difficulty: 'Advanced', estimatedWeeks: 6, icon: <Star className="w-6 h-6" /> },
];

export default function NextLevel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [completionPct, setCompletionPct] = useState(0);
  const [targetRole, setTargetRole] = useState('');
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [tasksRes, goalsRes] = await Promise.all([
        supabase.from('tasks').select('is_completed').eq('user_id', user.id),
        supabase.from('user_goals').select('target_role').eq('user_id', user.id).maybeSingle(),
      ]);

      const tasks = tasksRes.data || [];
      const completed = tasks.filter(t => t.is_completed).length;
      setCompletionPct(tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0);

      const role = goalsRes.data?.target_role || '';
      setTargetRole(role);

      const roleNames: Record<string, string> = {
        frontend: 'Frontend Developer', backend: 'Backend Developer', fullstack: 'Full Stack Developer',
        'data-science': 'Data Scientist', 'ml-engineer': 'ML Engineer', devops: 'DevOps Engineer',
        mobile: 'Mobile Developer', cloud: 'Cloud Architect',
      };
      setRoleName(roleNames[role] || 'Developer');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const paths = advancedPathsByRole[targetRole] || defaultPaths;

  if (loading) {
    return (
      <DashboardLayout title="Next Level">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Next Level">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">Next-Level Learning Paths</h2>
          <p className="text-muted-foreground">
            {completionPct >= 80
              ? `Congratulations on your progress as a ${roleName}! Here are advanced paths to continue your growth.`
              : `You're ${completionPct}% through your current roadmap. Complete more tasks to unlock these advanced paths!`}
          </p>
        </div>

        {/* Current Progress */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="font-medium">Current Roadmap Progress</span>
              </div>
              <Badge variant={completionPct >= 80 ? 'default' : 'secondary'}>
                {completionPct}%
              </Badge>
            </div>
            <Progress value={completionPct} className="h-3" />
            {completionPct < 80 && (
              <p className="text-sm text-muted-foreground mt-2">
                Reach 80% to fully unlock advanced paths. <Link to="/roadmap" className="text-primary hover:underline">Continue your roadmap →</Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Advanced Paths */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map((path) => {
            const isLocked = completionPct < 50;
            return (
              <Card
                key={path.id}
                className={`transition-all duration-200 ${
                  isLocked ? 'opacity-60' : 'hover:shadow-lg hover:border-primary/50'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {path.icon}
                    </div>
                    <Badge variant={path.difficulty === 'Advanced' ? 'default' : 'secondary'}>
                      {path.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {path.topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{path.estimatedWeeks} weeks</span>
                    <span>~{path.estimatedWeeks * 10}h total</span>
                  </div>
                  <Button 
                    className="w-full" 
                    variant={isLocked ? 'outline' : 'default'}
                    disabled={isLocked}
                  >
                    {isLocked ? 'Complete current roadmap first' : 'Coming Soon'}
                    {!isLocked && <Sparkles className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
