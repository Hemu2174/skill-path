import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  BookOpen, 
  BarChart3, 
  Award,
  CheckCircle2,
  Users,
  Star
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Personalized Roadmaps',
    description: 'Get a custom learning path tailored to your career goals and available time.',
  },
  {
    icon: BookOpen,
    title: 'Curated Content',
    description: 'Access high-quality lessons, projects, and quizzes designed by experts.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your growth with detailed analytics and weekly reports.',
  },
  {
    icon: Award,
    title: 'Earn Certificates',
    description: 'Showcase your skills with certificates upon completing learning paths.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Learners' },
  { value: '50+', label: 'Learning Paths' },
  { value: '500+', label: 'Lessons' },
  { value: '95%', label: 'Satisfaction Rate' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: 'S',
    content: 'SkillPath helped me transition from marketing to frontend development in just 3 months!',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Data Scientist',
    avatar: 'J',
    content: 'The personalized roadmap kept me focused. Best learning platform I\'ve used.',
    rating: 5,
  },
  {
    name: 'Maria Garcia',
    role: 'Full Stack Developer',
    avatar: 'M',
    content: 'The AI recommendations are spot on. It feels like having a personal mentor.',
    rating: 5,
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold">SkillPath</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="gradient-primary">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Learning Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Accelerate Your Career with{' '}
              <span className="gradient-text">Personalized Learning</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Get a custom roadmap designed just for you. Track your progress, complete projects, 
              and earn certificates as you master new skills.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="gradient-primary text-lg px-8 py-6"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6"
              >
                View Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-display font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform adapts to your learning style and pace, 
              ensuring you get the most out of every study session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and begin your learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Set Your Goals', desc: 'Tell us about your career aspirations and available time.' },
              { step: 2, title: 'Get Your Roadmap', desc: 'Receive a personalized learning path tailored just for you.' },
              { step: 3, title: 'Start Learning', desc: 'Complete lessons, projects, and earn certificates.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-glow">
                    {item.step}
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                {item.step < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Loved by Learners
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of professionals who transformed their careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="overflow-hidden">
            <div className="gradient-primary p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join SkillPath today and get a personalized learning roadmap 
                that takes you from where you are to where you want to be.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/auth')}
                className="text-lg px-8"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">SkillPath</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 SkillPath. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
