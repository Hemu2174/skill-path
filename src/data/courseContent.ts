// Role-specific course content with real YouTube videos and test questions
// Videos are real educational content from YouTube

interface ConceptTemplate {
  title: string;
  description: string;
  videoId: string; // YouTube video ID
  videoRequiredSeconds: number;
  practiceTask: string;
}

interface TestQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface WeekTemplate {
  title: string;
  description: string;
  concepts: ConceptTemplate[];
  testQuestions: TestQuestion[];
}

const frontendWeeks: WeekTemplate[] = [
  {
    title: 'Week 1: HTML & CSS Foundations',
    description: 'Master the building blocks of the web',
    concepts: [
      { title: 'HTML Document Structure', description: 'Learn semantic HTML elements, document flow, and best practices for structuring web pages.', videoId: 'UB1O30fR-EE', videoRequiredSeconds: 120, practiceTask: 'Create an HTML page with a header, nav, main content area with sections, and a footer. Use semantic tags like <article>, <aside>, and <figure>.' },
      { title: 'CSS Box Model & Layout', description: 'Understand margins, padding, borders, and how elements are sized and positioned.', videoId: 'rIO5326FgPE', videoRequiredSeconds: 120, practiceTask: 'Build a card component with proper padding, margins, and borders. Create a 3-column layout using CSS Grid.' },
      { title: 'Flexbox & Responsive Design', description: 'Create flexible layouts that adapt to any screen size using Flexbox and media queries.', videoId: 'fYq5PXgSsbE', videoRequiredSeconds: 120, practiceTask: 'Build a responsive navigation bar that collapses into a hamburger menu on mobile. Use Flexbox for alignment.' },
    ],
    testQuestions: [
      { question: 'What does the CSS box model consist of?', options: ['Content, Padding, Border, Margin', 'Header, Body, Footer, Sidebar', 'Display, Position, Float, Clear', 'Width, Height, Color, Font'], correctIndex: 0 },
      { question: 'Which HTML element is used for the main content of a document?', options: ['<div>', '<section>', '<main>', '<content>'], correctIndex: 2 },
      { question: 'What CSS property makes a container a flex container?', options: ['position: flex', 'display: flex', 'flex: true', 'layout: flex'], correctIndex: 1 },
      { question: 'What unit is relative to the viewport width?', options: ['px', 'em', 'vw', 'rem'], correctIndex: 2 },
      { question: 'Which is NOT a valid CSS selector?', options: ['.class', '#id', '@element', ':hover'], correctIndex: 2 },
    ],
  },
  {
    title: 'Week 2: JavaScript Fundamentals',
    description: 'Core JavaScript concepts for web development',
    concepts: [
      { title: 'Variables, Types & Functions', description: 'Learn about let, const, data types, and function declarations including arrow functions.', videoId: 'W6NZfCJ1LWs', videoRequiredSeconds: 120, practiceTask: 'Write a function that takes an array of numbers and returns an object with min, max, average, and sum values.' },
      { title: 'DOM Manipulation', description: 'Select, modify, and create HTML elements dynamically using JavaScript.', videoId: 'y17RuWkWdn8', videoRequiredSeconds: 120, practiceTask: 'Build a dynamic todo list that adds, removes, and toggles items using only vanilla JavaScript DOM methods.' },
      { title: 'Async JavaScript & Fetch API', description: 'Handle asynchronous operations with Promises, async/await, and make HTTP requests.', videoId: 'PoRJizFvM7s', videoRequiredSeconds: 120, practiceTask: 'Fetch data from a public API (like JSONPlaceholder) and display a list of posts with error handling and loading states.' },
    ],
    testQuestions: [
      { question: 'What is the difference between let and const?', options: ['let is faster', 'const cannot be reassigned', 'let is block-scoped, const is not', 'There is no difference'], correctIndex: 1 },
      { question: 'What does document.querySelector() return?', options: ['All matching elements', 'The first matching element', 'A boolean', 'The document itself'], correctIndex: 1 },
      { question: 'What keyword is used to pause execution until a Promise resolves?', options: ['wait', 'pause', 'await', 'resolve'], correctIndex: 2 },
      { question: 'Which method converts a JSON string to a JavaScript object?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.decode()'], correctIndex: 1 },
      { question: 'What is a closure in JavaScript?', options: ['A way to close the browser', 'A function with access to its outer scope', 'A type of loop', 'A CSS property'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 3: React Basics',
    description: 'Build user interfaces with React components',
    concepts: [
      { title: 'Components & JSX', description: 'Create reusable UI components using JSX syntax and understand the component lifecycle.', videoId: 'Tn6-PIqc4UM', videoRequiredSeconds: 120, practiceTask: 'Create a ProfileCard component that accepts name, bio, and avatar as props. Create a parent component that renders 3 different ProfileCards.' },
      { title: 'State & Props', description: 'Manage component data with useState and pass data between components with props.', videoId: 'O6P86uwfdR0', videoRequiredSeconds: 120, practiceTask: 'Build a counter component with increment, decrement, and reset. Add a display component that shows the count with conditional styling (red if negative, green if positive).' },
      { title: 'Event Handling & Lists', description: 'Handle user interactions and render dynamic lists with the map function.', videoId: 'EzGl38YJ_FM', videoRequiredSeconds: 120, practiceTask: 'Build a searchable contact list. Users can add contacts, search by name, and delete contacts. Use proper React patterns for list rendering.' },
    ],
    testQuestions: [
      { question: 'What is JSX?', options: ['A JavaScript framework', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A database query language'], correctIndex: 1 },
      { question: 'Which hook is used to manage state in a functional component?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correctIndex: 1 },
      { question: 'How do you pass data from parent to child component?', options: ['Using state', 'Using props', 'Using context only', 'Using localStorage'], correctIndex: 1 },
      { question: 'What is the key prop used for when rendering lists?', options: ['Styling elements', 'Helping React identify which items changed', 'Setting the order', 'Creating unique CSS classes'], correctIndex: 1 },
      { question: 'What does useEffect with an empty dependency array do?', options: ['Runs on every render', 'Runs only on mount', 'Never runs', 'Runs on unmount only'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 4: Advanced React & State Management',
    description: 'Master hooks, context, and state patterns',
    concepts: [
      { title: 'useEffect & Side Effects', description: 'Handle data fetching, subscriptions, and DOM updates with the useEffect hook.', videoId: 'QQYeipc_cik', videoRequiredSeconds: 120, practiceTask: 'Create a component that fetches weather data on mount, refetches when a city input changes, and cleans up any intervals on unmount.' },
      { title: 'Context API & Custom Hooks', description: 'Share state across components without prop drilling and extract reusable logic.', videoId: 'HYKDUF8X3qI', videoRequiredSeconds: 120, practiceTask: 'Create a ThemeContext with a custom useTheme hook. Build a theme toggle that switches between light/dark modes across multiple components.' },
      { title: 'React Router & Navigation', description: 'Add client-side routing with nested routes, dynamic parameters, and navigation guards.', videoId: 'oTIJunBa6MA', videoRequiredSeconds: 120, practiceTask: 'Build a multi-page app with a dashboard, profile, and settings page. Add a protected route that redirects unauthenticated users.' },
    ],
    testQuestions: [
      { question: 'When does useEffect cleanup function run?', options: ['On mount only', 'On unmount and before re-running the effect', 'Never', 'Only when state changes'], correctIndex: 1 },
      { question: 'What problem does Context API solve?', options: ['State management', 'Prop drilling', 'CSS styling', 'API calls'], correctIndex: 1 },
      { question: 'What is a custom hook?', options: ['A built-in React function', 'A function starting with "use" that uses other hooks', 'A CSS class', 'A component type'], correctIndex: 1 },
      { question: 'Which React Router component renders the first matching route?', options: ['<Switch>', '<Routes>', '<Router>', '<Match>'], correctIndex: 1 },
      { question: 'What is the purpose of useMemo?', options: ['To create memos', 'To memoize expensive computations', 'To store passwords', 'To create side effects'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 5: TypeScript & Testing',
    description: 'Add type safety and test your applications',
    concepts: [
      { title: 'TypeScript Basics', description: 'Add static types to your JavaScript code with interfaces, types, and generics.', videoId: 'BwuLxPH8IDs', videoRequiredSeconds: 120, practiceTask: 'Convert a plain JavaScript React component to TypeScript. Define interfaces for props, state, and API response types.' },
      { title: 'Testing with Vitest', description: 'Write unit and integration tests for your React components and hooks.', videoId: 'cM_AeQHzlGg', videoRequiredSeconds: 120, practiceTask: 'Write tests for a utility function and a React component. Test user interactions, state changes, and edge cases.' },
      { title: 'Error Handling & Performance', description: 'Implement error boundaries, optimize renders, and handle edge cases gracefully.', videoId: '3yEMIGWbyOQ', videoRequiredSeconds: 120, practiceTask: 'Add error boundaries to your app. Implement React.memo and useCallback to optimize a list that re-renders unnecessarily.' },
    ],
    testQuestions: [
      { question: 'What is the difference between interface and type in TypeScript?', options: ['No difference', 'Interfaces can be extended, types use intersections', 'Types are faster', 'Interfaces are deprecated'], correctIndex: 1 },
      { question: 'What testing library renders React components for testing?', options: ['Jest', 'React Testing Library', 'Mocha', 'Cypress'], correctIndex: 1 },
      { question: 'What is an Error Boundary in React?', options: ['A CSS border', 'A class component that catches rendering errors', 'A try-catch block', 'A TypeScript feature'], correctIndex: 1 },
      { question: 'What does React.memo do?', options: ['Creates memos', 'Prevents unnecessary re-renders', 'Manages state', 'Handles errors'], correctIndex: 1 },
      { question: 'What TypeScript utility type makes all properties optional?', options: ['Required<T>', 'Partial<T>', 'Optional<T>', 'Maybe<T>'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 6: Capstone & Deployment',
    description: 'Build and deploy a complete application',
    concepts: [
      { title: 'Project Architecture & Planning', description: 'Design the architecture for a full-featured application with proper folder structure and patterns.', videoId: 'CvAcHkMC0rQ', videoRequiredSeconds: 120, practiceTask: 'Create a project plan with component hierarchy, data flow diagram, and API endpoints. Set up the project with proper folder structure.' },
      { title: 'Building the Capstone Project', description: 'Implement the core features of your portfolio project step by step.', videoId: 'b9eMGE7QtTk', videoRequiredSeconds: 120, practiceTask: 'Build the core CRUD functionality of your capstone project with proper state management, routing, and error handling.' },
      { title: 'Deployment & Portfolio', description: 'Deploy your application and prepare it for your professional portfolio.', videoId: 'eSeBVcKZx9Y', videoRequiredSeconds: 120, practiceTask: 'Deploy your capstone project to Vercel or Netlify. Add README documentation, lighthouse performance audit, and prepare a demo presentation.' },
    ],
    testQuestions: [
      { question: 'What is the recommended way to structure a React project?', options: ['One large file', 'Feature-based folders', 'Alphabetical files', 'No structure needed'], correctIndex: 1 },
      { question: 'Which is a popular deployment platform for React apps?', options: ['MySQL', 'Vercel', 'PostgreSQL', 'Redis'], correctIndex: 1 },
      { question: 'What should a good README include?', options: ['Only the title', 'Setup instructions, features, and usage', 'Just the license', 'A selfie'], correctIndex: 1 },
      { question: 'What tool measures web performance?', options: ['Lighthouse', 'Telescope', 'Microscope', 'Periscope'], correctIndex: 0 },
      { question: 'What is CI/CD?', options: ['A programming language', 'Continuous Integration / Continuous Deployment', 'A CSS framework', 'A React hook'], correctIndex: 1 },
    ],
  },
];

// Map for other roles - using frontend as base and customizing titles
const roleContentMap: Record<string, WeekTemplate[]> = {
  frontend: frontendWeeks,
  // Other roles will use similar structure with different topics
};

export function getCourseContent(role: string): WeekTemplate[] {
  // Return role-specific content or adapt frontend content
  return roleContentMap[role] || frontendWeeks.map(week => ({
    ...week,
    title: week.title,
    concepts: week.concepts.map(c => ({ ...c })),
    testQuestions: week.testQuestions.map(q => ({ ...q })),
  }));
}

export type { WeekTemplate, ConceptTemplate, TestQuestion };
