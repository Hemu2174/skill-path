# Skill Path - Personalized Learning Platform

A modern, AI-powered learning platform that provides personalized skill development paths with real-time progress tracking, weekly assessments, and intelligent mentorship.

## 🚀 Features

- **Personalized Learning Paths**: Customized course recommendations based on your goals and progress
- **AI Mentor**: Get instant help and guidance from an AI-powered mentor
- **Progress Tracking**: Real-time visualization of your learning journey and skill development
- **Weekly Check-ins & Tests**: Regular assessments to reinforce learning and track improvement
- **Interactive Roadmap**: Visual representation of your learning path and milestones
- **Course Library**: Access to comprehensive course content across various skill areas
- **Onboarding Experience**: Smooth introduction to the platform with personalized setup
- **Dashboard Analytics**: Overview of your learning activities, achievements, and recommendations
- **Schedule Management**: Plan and organize your learning sessions
- **Dark/Light Theme**: Customizable UI theme for comfortable learning

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Vitest** for testing

### Backend & Services
- **Supabase** for authentication, database, and real-time features
- **Edge Functions** for serverless AI mentor and weekly feedback processing

### Build Tools
- **Bun** as package manager and runtime
- **ESLint** for code linting
- **PostCSS** for CSS processing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) package manager
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local development)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skill-path.git
   cd skill-path
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   Initialize Supabase locally:
   ```bash
   supabase init
   supabase start
   ```
   
   Apply migrations:
   ```bash
   supabase db reset
   ```

## 🚀 Development

Start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:5173`

### Run Supabase Functions Locally

```bash
supabase functions serve
```

## 🧪 Testing

Run the test suite:

```bash
bun test
```

Run tests in watch mode:

```bash
bun test --watch
```

## 📁 Project Structure

```
skill-path/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── layout/      # Layout components (Sidebar, DashboardLayout)
│   │   └── ui/          # UI components (shadcn/ui)
│   ├── data/            # Static data and course content
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Third-party integrations (Supabase)
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   └── test/            # Test files
├── supabase/
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
└── ...config files
```

## 🎯 Key Components

### Pages
- **Dashboard**: Main overview of learning progress and activities
- **Courses**: Browse and access available courses
- **CourseLearning**: Interactive course content and lessons
- **Progress**: Detailed progress tracking and analytics
- **Roadmap**: Visual learning path with milestones
- **WeeklyCheckin**: Regular progress check-ins
- **WeeklyTest**: Assessment tests
- **FinalAssessment**: Course completion assessments
- **Settings**: User preferences and account settings

### Custom Hooks
- `useAuth`: Authentication state management
- `useAIMentor`: AI mentor chat functionality
- `useCourseData`: Course content management
- `useProgressData`: Progress tracking
- `useSkillsProgress`: Skill development metrics
- `useRealtimeTasks`: Real-time task updates
- `useTheme`: Theme switching (dark/light mode)

## 🔐 Authentication

The platform uses Supabase Authentication supporting:
- Email/Password authentication
- OAuth providers (configurable)
- Secure session management

## 🗄️ Database

Database schema includes:
- User profiles and preferences
- Course content and progress
- Skill assessments and metrics
- Learning schedules
- AI mentor chat history
- Recommendations and feedback

## 🚢 Deployment

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

### Deploy to Supabase

```bash
supabase functions deploy ai-mentor
supabase functions deploy weekly-feedback
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Supabase](https://supabase.com/) for backend infrastructure
- [Vite](https://vitejs.dev/) for blazing fast development experience

## 📧 Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ for learners everywhere
