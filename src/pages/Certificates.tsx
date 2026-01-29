import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Download, 
  Share2, 
  ExternalLink,
  Lock,
  Calendar,
  Trophy
} from 'lucide-react';

const earnedCertificates = [
  {
    id: 1,
    title: 'HTML & CSS Fundamentals',
    description: 'Mastered the basics of web development',
    issuedAt: '2025-01-15',
    credential: 'CERT-HTML-001',
    image: '🏅',
  },
  {
    id: 2,
    title: 'JavaScript Essentials',
    description: 'Demonstrated proficiency in JavaScript programming',
    issuedAt: '2025-01-22',
    credential: 'CERT-JS-002',
    image: '🏆',
  },
];

const upcomingCertificates = [
  {
    id: 3,
    title: 'React Developer',
    description: 'Complete the React learning path',
    progress: 65,
    tasksRemaining: 8,
    image: '⚛️',
  },
  {
    id: 4,
    title: 'TypeScript Expert',
    description: 'Master TypeScript for modern development',
    progress: 30,
    tasksRemaining: 14,
    image: '📘',
  },
  {
    id: 5,
    title: 'Full Stack Developer',
    description: 'Complete the full stack learning journey',
    progress: 15,
    tasksRemaining: 32,
    image: '🚀',
  },
];

export default function Certificates() {
  return (
    <DashboardLayout title="Certificates">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl gradient-primary">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{earnedCertificates.length}</p>
                  <p className="text-sm text-muted-foreground">Certificates Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-2/10">
                  <Trophy className="w-6 h-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingCertificates.length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-3/10">
                  <Calendar className="w-6 h-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Jan 22</p>
                  <p className="text-sm text-muted-foreground">Last Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="earned" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="earned">Earned ({earnedCertificates.length})</TabsTrigger>
            <TabsTrigger value="progress">In Progress ({upcomingCertificates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="earned" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {earnedCertificates.map((cert) => (
                <Card key={cert.id} className="overflow-hidden">
                  <div className="gradient-primary p-6 text-white text-center">
                    <div className="text-6xl mb-4">{cert.image}</div>
                    <h3 className="text-xl font-display font-bold">{cert.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{cert.description}</p>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Issued</p>
                        <p className="font-medium">{new Date(cert.issuedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Credential ID</p>
                        <p className="font-mono text-sm">{cert.credential}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {upcomingCertificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-32 md:h-auto bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-6xl">
                      {cert.image}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-display font-semibold">{cert.title}</h3>
                            <Badge variant="secondary">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{cert.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{cert.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full gradient-primary rounded-full transition-all"
                            style={{ width: `${cert.progress}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {cert.tasksRemaining} tasks remaining to unlock
                        </p>
                      </div>
                    </div>
                    <div className="p-6 flex items-center border-t md:border-t-0 md:border-l border-border">
                      <Button>Continue Learning</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
