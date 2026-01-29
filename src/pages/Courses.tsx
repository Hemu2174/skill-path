import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Users, 
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const activeCourses = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Learn the core concepts of React including components, state, and props',
    image: '🚀',
    progress: 65,
    lessonsCompleted: 8,
    totalLessons: 12,
    duration: '4 hours',
    category: 'Frontend',
  },
  {
    id: 2,
    title: 'TypeScript Essentials',
    description: 'Master TypeScript for better code quality and developer experience',
    image: '📘',
    progress: 30,
    lessonsCompleted: 3,
    totalLessons: 10,
    duration: '3 hours',
    category: 'Programming',
  },
  {
    id: 3,
    title: 'Modern CSS Techniques',
    description: 'Advanced CSS with Flexbox, Grid, and modern layout patterns',
    image: '🎨',
    progress: 85,
    lessonsCompleted: 11,
    totalLessons: 13,
    duration: '2.5 hours',
    category: 'Frontend',
  },
];

const recommendedCourses = [
  {
    id: 4,
    title: 'State Management with Zustand',
    description: 'Simple and powerful state management for React applications',
    image: '🐻',
    duration: '2 hours',
    lessons: 8,
    rating: 4.8,
    students: 1240,
    category: 'Frontend',
  },
  {
    id: 5,
    title: 'API Design Best Practices',
    description: 'Design RESTful APIs that are scalable and maintainable',
    image: '⚙️',
    duration: '3 hours',
    lessons: 10,
    rating: 4.9,
    students: 890,
    category: 'Backend',
  },
  {
    id: 6,
    title: 'Testing React Applications',
    description: 'Write comprehensive tests with Jest and React Testing Library',
    image: '🧪',
    duration: '4 hours',
    lessons: 15,
    rating: 4.7,
    students: 2100,
    category: 'Testing',
  },
  {
    id: 7,
    title: 'Git & GitHub Mastery',
    description: 'Version control workflows for professional development',
    image: '🔀',
    duration: '2.5 hours',
    lessons: 12,
    rating: 4.8,
    students: 3500,
    category: 'DevOps',
  },
];

export default function Courses() {
  return (
    <DashboardLayout title="My Courses">
      <div className="space-y-6">
        <Tabs defaultValue="active" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="active">Active Courses</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <TabsContent value="active" className="space-y-4">
            {activeCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Course Image/Icon */}
                    <div className="md:w-48 h-32 md:h-auto bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-6xl">
                      {course.image}
                    </div>
                    
                    {/* Course Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {course.category}
                          </Badge>
                          <h3 className="text-xl font-display font-semibold">{course.title}</h3>
                          <p className="text-muted-foreground mt-1">{course.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.lessonsCompleted}/{course.totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium">{course.progress}% complete</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="p-6 flex items-center border-t md:border-t-0 md:border-l border-border">
                      <Button className="gradient-primary">
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl">
                        {course.image}
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">
                          {course.category}
                        </Badge>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{course.description}</CardDescription>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessons} lessons
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {course.students.toLocaleString()}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Enroll
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No completed courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Keep learning! Your completed courses will appear here.
                </p>
                <Button asChild>
                  <Link to="/roadmap">Continue Learning</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
