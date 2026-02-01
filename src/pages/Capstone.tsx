import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Rocket, 
  Upload, 
  Link as LinkIcon,
  Github,
  ExternalLink,
  Award,
  CheckCircle2,
  FileText,
  Briefcase,
  Star,
  Download,
  Share2,
  Sparkles,
  Trophy,
  Code,
  Palette,
  Database
} from 'lucide-react';

interface CapstoneProject {
  id: string;
  project_name: string;
  project_url: string;
  github_url: string;
  description: string;
  submitted_at: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
}

interface PortfolioItem {
  id: string;
  title: string;
  type: string;
  completedAt: string;
  skills: string[];
}

export default function Capstone() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userGoal, setUserGoal] = useState<any>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [certificate, setCertificate] = useState<any>(null);

  // Mock portfolio items based on completed tasks
  const portfolioItems: PortfolioItem[] = [
    {
      id: '1',
      title: 'Personal Portfolio Website',
      type: 'Project',
      completedAt: '2025-01-15',
      skills: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: '2',
      title: 'React Todo Application',
      type: 'Project',
      completedAt: '2025-01-22',
      skills: ['React', 'TypeScript', 'Tailwind']
    },
    {
      id: '3',
      title: 'REST API Integration',
      type: 'Exercise',
      completedAt: '2025-01-25',
      skills: ['API', 'Fetch', 'Async/Await']
    }
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch user goals
      const { data: goals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setUserGoal(goals);

      // Calculate overall progress
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (tasks && tasks.length > 0) {
        const completed = tasks.filter(t => t.is_completed).length;
        setOverallProgress(Math.round((completed / tasks.length) * 100));
      }

      // Check for existing certificate
      const { data: certs } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false })
        .limit(1);

      if (certs && certs.length > 0) {
        setCertificate(certs[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProject = async () => {
    if (!user) return;
    if (!projectName || !projectUrl || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Get user's roadmap
      const { data: roadmap } = await supabase
        .from('roadmaps')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Create progress log for capstone submission
      await supabase
        .from('progress_logs')
        .insert({
          user_id: user.id,
          log_type: 'capstone_submission',
          data: {
            project_name: projectName,
            project_url: projectUrl,
            github_url: githubUrl,
            description: description,
            submitted_at: new Date().toISOString()
          }
        });

      // Issue certificate if progress is high enough
      if (overallProgress >= 80) {
        const roleName = getRoleName(userGoal?.target_role);
        await supabase
          .from('certificates')
          .insert({
            user_id: user.id,
            roadmap_id: roadmap?.id,
            title: `${roleName} Learning Path Certificate`,
            certificate_url: `https://skillpath.app/verify/${user.id.slice(0, 8)}`
          });
      }

      setSubmitted(true);
      toast.success('Capstone project submitted successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit project');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleName = (roleId: string) => {
    const roles: Record<string, string> = {
      'frontend': 'Frontend Developer',
      'backend': 'Backend Developer',
      'fullstack': 'Full Stack Developer',
      'data-science': 'Data Scientist',
      'ml-engineer': 'ML Engineer',
      'devops': 'DevOps Engineer',
      'mobile': 'Mobile Developer',
      'cloud': 'Cloud Architect'
    };
    return roles[roleId] || 'Developer';
  };

  const canSubmitCapstone = overallProgress >= 75;

  return (
    <DashboardLayout title="Capstone & Portfolio">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Rocket className="w-7 h-7 text-primary" />
              Final Stage
            </h2>
            <p className="text-muted-foreground mt-1">
              Submit your capstone project and showcase your portfolio
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {overallProgress}% Complete
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Learning Progress</span>
                  <span className="text-primary font-bold">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {canSubmitCapstone 
                    ? '✅ You can now submit your capstone project!'
                    : `Complete ${75 - overallProgress}% more to unlock capstone submission`
                  }
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-sm font-medium">Goal</p>
                <p className="text-xs text-muted-foreground">{getRoleName(userGoal?.target_role)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="capstone" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="capstone">Capstone Project</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="certificate">Certificate</TabsTrigger>
            <TabsTrigger value="next">Next Steps</TabsTrigger>
          </TabsList>

          {/* Capstone Submission */}
          <TabsContent value="capstone">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Capstone Project Submission
                </CardTitle>
                <CardDescription>
                  Submit your final project to complete the learning path
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Project Submitted!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your capstone project has been submitted for review.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {!canSubmitCapstone && (
                      <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                        <p className="text-sm text-warning-foreground">
                          ⚠️ Complete at least 75% of your learning path to submit your capstone project.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name *</Label>
                        <Input
                          id="projectName"
                          placeholder="e.g., E-commerce Dashboard"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          disabled={!canSubmitCapstone}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectUrl">Live Demo URL *</Label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="projectUrl"
                            placeholder="https://your-project.com"
                            className="pl-10"
                            value={projectUrl}
                            onChange={(e) => setProjectUrl(e.target.value)}
                            disabled={!canSubmitCapstone}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="githubUrl">GitHub Repository (Optional)</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="githubUrl"
                          placeholder="https://github.com/username/project"
                          className="pl-10"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          disabled={!canSubmitCapstone}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your project, technologies used, and key features..."
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={!canSubmitCapstone}
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitProject}
                      disabled={!canSubmitCapstone || submitting}
                      className="w-full gradient-primary"
                    >
                      {submitting ? 'Submitting...' : 'Submit Capstone Project'}
                      <Upload className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Your Portfolio
                </CardTitle>
                <CardDescription>
                  Projects and exercises you've completed during your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
                        {item.type === 'Project' ? (
                          <Code className="w-12 h-12 text-primary" />
                        ) : (
                          <FileText className="w-12 h-12 text-chart-2" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">{item.type}</Badge>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Completed {new Date(item.completedAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificate */}
          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Your Certificate
                </CardTitle>
                <CardDescription>
                  Your achievement certificate upon completing the learning path
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificate || overallProgress >= 80 ? (
                  <div className="text-center">
                    <div className="max-w-lg mx-auto p-8 rounded-xl border-4 border-primary/20 bg-gradient-to-br from-card to-primary/5">
                      <div className="text-6xl mb-4">🏆</div>
                      <h2 className="text-2xl font-display font-bold mb-2">Certificate of Completion</h2>
                      <p className="text-muted-foreground mb-4">This certifies that</p>
                      <p className="text-xl font-semibold text-primary mb-4">
                        {user?.user_metadata?.full_name || 'Learner'}
                      </p>
                      <p className="text-muted-foreground mb-4">has successfully completed the</p>
                      <p className="text-lg font-medium mb-6">
                        {getRoleName(userGoal?.target_role)} Learning Path
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="w-4 h-4" />
                        <span>Issued by SkillPath AI</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 justify-center mt-6">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share on LinkedIn
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Award className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Certificate Locked</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete 80% of your learning path to earn your certificate.
                    </p>
                    <div className="max-w-xs mx-auto">
                      <Progress value={overallProgress} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">{overallProgress}% / 80% required</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Next Steps */}
          <TabsContent value="next">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  What's Next?
                </CardTitle>
                <CardDescription>
                  Continue your learning journey with advanced paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Database className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Advanced Backend</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Master databases, APIs, and server architecture
                      </p>
                      <Badge>8 weeks</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-chart-2/50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
                        <Palette className="w-8 h-8 text-chart-2" />
                      </div>
                      <h3 className="font-semibold mb-2">UI/UX Design</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn design principles and create stunning interfaces
                      </p>
                      <Badge>6 weeks</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-chart-3/50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-chart-3/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-chart-3" />
                      </div>
                      <h3 className="font-semibold mb-2">AI Integration</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add AI capabilities to your applications
                      </p>
                      <Badge>4 weeks</Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl gradient-primary">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Congratulations on your journey!</h3>
                      <p className="text-sm text-muted-foreground">
                        You've built a strong foundation. Keep learning and building amazing things!
                      </p>
                    </div>
                    <Button className="gradient-primary">
                      Explore Paths
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
