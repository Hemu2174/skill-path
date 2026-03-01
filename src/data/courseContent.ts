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
      { title: 'HTML Document Structure', description: 'Learn semantic HTML elements, document flow, and best practices for structuring web pages.', videoId: 'pQN-pnXPaVg', videoRequiredSeconds: 120, practiceTask: 'Create an HTML page with a header, nav, main content area with sections, and a footer. Use semantic tags like <article>, <aside>, and <figure>.' },
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
      { title: 'Variables, Types & Functions', description: 'Learn about let, const, data types, and function declarations including arrow functions.', videoId: 'hdI2bqOjy3c', videoRequiredSeconds: 120, practiceTask: 'Write a function that takes an array of numbers and returns an object with min, max, average, and sum values.' },
      { title: 'DOM Manipulation', description: 'Select, modify, and create HTML elements dynamically using JavaScript.', videoId: '0ik6X4DJKCc', videoRequiredSeconds: 120, practiceTask: 'Build a dynamic todo list that adds, removes, and toggles items using only vanilla JavaScript DOM methods.' },
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
      { title: 'Components & JSX', description: 'Create reusable UI components using JSX syntax and understand the component lifecycle.', videoId: 'w7ejDZ8SWv8', videoRequiredSeconds: 120, practiceTask: 'Create a ProfileCard component that accepts name, bio, and avatar as props. Create a parent component that renders 3 different ProfileCards.' },
      { title: 'State & Props', description: 'Manage component data with useState and pass data between components with props.', videoId: 'O6P86uwfdR0', videoRequiredSeconds: 120, practiceTask: 'Build a counter component with increment, decrement, and reset. Add a display component that shows the count with conditional styling (red if negative, green if positive).' },
      { title: 'Event Handling & Lists', description: 'Handle user interactions and render dynamic lists with the map function.', videoId: 'vhnfJ5RPVJA', videoRequiredSeconds: 120, practiceTask: 'Build a searchable contact list. Users can add contacts, search by name, and delete contacts. Use proper React patterns for list rendering.' },
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

// Backend Developer Curriculum
const backendWeeks: WeekTemplate[] = [
  {
    title: 'Week 1: Node.js & Express Basics',
    description: 'Build server applications with Node.js and Express framework',
    concepts: [
      { title: 'Node.js Fundamentals', description: 'Understand the Node.js runtime, event loop, and asynchronous programming model.', videoId: 'fBNz5xF-Kx4', videoRequiredSeconds: 120, practiceTask: 'Build a simple Node.js server that handles HTTP requests and responses. Create routes for GET and POST endpoints.' },
      { title: 'Express.js Framework', description: 'Learn Express.js for building web applications with middleware and routing.', videoId: 'L72fhGm1tfE', videoRequiredSeconds: 120, practiceTask: 'Create an Express server with multiple routes, middleware for logging, error handling, and JSON response formatting.' },
      { title: 'Request & Response Handling', description: 'Master HTTP methods, request parsing, and response formatting for APIs.', videoId: 'pKd0Rpw7O48', videoRequiredSeconds: 120, practiceTask: 'Build an API endpoint that accepts query parameters and request body, validates input, and returns appropriate JSON responses.' },
    ],
    testQuestions: [
      { question: 'What is the Event Loop in Node.js?', options: ['A framework for building apps', 'A mechanism for handling asynchronous operations', 'A JavaScript feature only', 'A database query tool'], correctIndex: 1 },
      { question: 'Which middleware function logs HTTP requests in Express?', options: ['morgan', 'express-log', 'http-logger', 'request-tracer'], correctIndex: 0 },
      { question: 'What HTTP method is used to create a new resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctIndex: 1 },
      { question: 'How do you handle errors in Express?', options: ['try-catch only', 'Error middleware with 4 parameters', 'throw statements', 'None of the above'], correctIndex: 1 },
      { question: 'What does res.json() do?', options: ['Reads JSON', 'Sends JSON response', 'Parses JSON', 'Validates JSON'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 2: Databases & SQL',
    description: 'Store and query data with SQL databases',
    concepts: [
      { title: 'SQL Fundamentals', description: 'Learn SQL queries for creating tables, inserting, updating, and deleting data.', videoId: 'HXV3zeQKqGY', videoRequiredSeconds: 120, practiceTask: 'Design a relational database schema with multiple tables. Write CREATE, INSERT, UPDATE, and DELETE queries.' },
      { title: 'Database Design & Relationships', description: 'Understand primary keys, foreign keys, normalization, and table relationships.', videoId: 'ztHopE5Wnpc', videoRequiredSeconds: 120, practiceTask: 'Create a normalized database design with entities, relationships, and constraints. Implement one-to-many and many-to-many relationships.' },
      { title: 'Node.js with Databases', description: 'Connect Node.js applications to databases using libraries like Sequelize or Knex.', videoId: 'ExcRbA7fy_A', videoRequiredSeconds: 120, practiceTask: 'Connect a Node.js app to a SQL database. Perform CRUD operations using an ORM like Sequelize.' },
    ],
    testQuestions: [
      { question: 'What is a PRIMARY KEY?', options: ['Any key', 'Uniquely identifies each row', 'Encrypts data', 'Sorts data'], correctIndex: 1 },
      { question: 'Which keyword retrieves data from a database?', options: ['FIND', 'SELECT', 'GET', 'RETRIEVE'], correctIndex: 1 },
      { question: 'What is normalization in databases?', options: ['Organizing data to reduce redundancy', 'Encrypting data', 'Backing up data', 'Deleting data'], correctIndex: 0 },
      { question: 'What is a FOREIGN KEY?', options: ['A secret key', 'Links to primary key in another table', 'Encrypts data', 'Validates input'], correctIndex: 1 },
      { question: 'What does JOIN do in SQL?', options: ['Appends data', 'Combines rows from related tables', 'Deletes rows', 'Updates records'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 3: RESTful APIs & Authentication',
    description: 'Build scalable APIs with proper security',
    concepts: [
      { title: 'REST API Principles', description: 'Understand REST architecture, resource-oriented design, and HTTP status codes.', videoId: 'HjEPCSqk9II', videoRequiredSeconds: 120, practiceTask: 'Design and build a RESTful API following REST principles. Use proper HTTP methods, status codes, and resource naming conventions.' },
      { title: 'Authentication & Authorization', description: 'Implement user authentication with JWT and manage user permissions.', videoId: 'oTqwcYvLlIQ', videoRequiredSeconds: 120, practiceTask: 'Implement JWT-based authentication. Create login endpoint, token generation, and protected routes with authorization checks.' },
      { title: 'API Security & Validation', description: 'Secure APIs with input validation, CORS, and protection against common attacks.', videoId: 'FmJY0UUaVF0', videoRequiredSeconds: 120, practiceTask: 'Add input validation, CORS configuration, and rate limiting to your API. Implement security headers and HTTPS.' },
    ],
    testQuestions: [
      { question: 'What does REST stand for?', options: ['Really Essential Server Tools', 'Representational State Transfer', 'Remote Server Terminal', 'Resource Extraction System'], correctIndex: 1 },
      { question: 'What is JWT?', options: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Tool', 'Java Web Technology'], correctIndex: 1 },
      { question: 'Which HTTP status code means the server successfully processed the request?', options: ['404', '200', '500', '401'], correctIndex: 1 },
      { question: 'What does CORS do?', options: ['Encrypts data', 'Controls cross-origin requests', 'Caches responses', 'Logs requests'], correctIndex: 1 },
      { question: 'How should passwords be stored in a database?', options: ['Plain text', 'Encrypted', 'Hashed with salt', 'In a separate file'], correctIndex: 2 },
    ],
  },
  {
    title: 'Week 4: Advanced Backend Patterns',
    description: 'Master design patterns and scalability',
    concepts: [
      { title: 'MVC Architecture', description: 'Organize code with Model-View-Controller pattern for maintainability.', videoId: 'pZV8cVX8-fE', videoRequiredSeconds: 120, practiceTask: 'Refactor an existing application into MVC architecture. Separate concerns with models, controllers, and routes.' },
      { title: 'Middleware & Error Handling', description: 'Create reusable middleware and implement comprehensive error handling strategies.', videoId: 'Pn1-qb48hhY', videoRequiredSeconds: 120, practiceTask: 'Build custom middleware for authentication, logging, and error handling. Implement global error handling with proper status codes.' },
      { title: 'Caching & Performance Optimization', description: 'Improve API performance with caching strategies and database query optimization.', videoId: '7qJNVxLQnF8', videoRequiredSeconds: 120, practiceTask: 'Implement Redis caching for frequent queries. Optimize database indexes and add pagination for large datasets.' },
    ],
    testQuestions: [
      { question: 'What does the Model in MVC represent?', options: ['User interface', 'Data and business logic', 'Control flow', 'Routing'], correctIndex: 1 },
      { question: 'What is middleware in Express?', options: ['A database', 'Functions that process requests', 'A security tool', 'A testing framework'], correctIndex: 1 },
      { question: 'What is caching used for?', options: ['Storing encrypted data', 'Reducing database queries', 'Managing user sessions', 'Validating input'], correctIndex: 1 },
      { question: 'Which caching solution is popular for Node.js?', options: ['MongoDB', 'Redis', 'PostgreSQL', 'MySQL'], correctIndex: 1 },
      { question: 'What is an index in databases?', options: ['A list of tables', 'A structure to speed up queries', 'A backup file', 'A query log'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 5: Testing & DevOps Basics',
    description: 'Write tests and deploy applications',
    concepts: [
      { title: 'Backend Testing with Jest', description: 'Write unit and integration tests for Node.js applications.', videoId: 'FgnXc_mY6PY', videoRequiredSeconds: 120, practiceTask: 'Write comprehensive test suites for API endpoints. Test happy paths, error cases, and edge cases with mocking.' },
      { title: 'CI/CD Pipelines', description: 'Automate testing and deployment with GitHub Actions or similar tools.', videoId: 'DtM8FIAMLVo', videoRequiredSeconds: 120, practiceTask: 'Set up a CI/CD pipeline that runs tests on every commit and deploys to a staging/production environment.' },
      { title: 'Monitoring & Logging', description: 'Implement logging and monitoring for production applications.', videoId: 'sKUx4QeB5v4', videoRequiredSeconds: 120, practiceTask: 'Add structured logging with Winston or Pino. Set up basic monitoring and alerts for application errors.' },
    ],
    testQuestions: [
      { question: 'What is Jest?', options: ['A backend framework', 'A testing framework', 'A database', 'A deployment tool'], correctIndex: 1 },
      { question: 'What does CI/CD stand for?', options: ['Customer Integration', 'Continuous Integration/Continuous Deployment', 'Code Isolation', 'Connection Interface'], correctIndex: 1 },
      { question: 'What is a mock in testing?', options: ['A fake implementation', 'A real service', 'A test database', 'A logging tool'], correctIndex: 0 },
      { question: 'What should you log in production?', options: ['All requests', 'Only errors', 'Critical events and errors', 'Nothing'], correctIndex: 2 },
      { question: 'What is a GitHub Action?', options: ['A feature request', 'A workflow automation tool', 'A deployment service', 'A monitoring tool'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 6: Capstone & Deployment',
    description: 'Build and deploy a complete backend application',
    concepts: [
      { title: 'API Design & Documentation', description: 'Design comprehensive APIs with Swagger/OpenAPI documentation.', videoId: 'VRW0qm5SZrw', videoRequiredSeconds: 120, practiceTask: 'Document your API with OpenAPI/Swagger. Include all endpoints, request/response schemas, authentication methods, and examples.' },
      { title: 'Building the Capstone Backend', description: 'Implement core features of a complex backend application.', videoId: 'GYYcgoSqPGE', videoRequiredSeconds: 120, practiceTask: 'Build a complete backend with multiple models, relationships, authentication, authorization, and business logic.' },
      { title: 'Deployment & Scaling', description: 'Deploy to production and handle scaling challenges.', videoId: 'WqxJ-nVFuVY', videoRequiredSeconds: 120, practiceTask: 'Deploy your API to Heroku or AWS. Set up environment configuration, database migrations, and automated backups.' },
    ],
    testQuestions: [
      { question: 'What is OpenAPI specification used for?', options: ['API documentation', 'Database design', 'Frontend development', 'Testing'], correctIndex: 0 },
      { question: 'What is a database migration?', options: ['Moving data to another server', 'Version controlling schema changes', 'Backing up data', 'Deleting old data'], correctIndex: 1 },
      { question: 'What does horizontal scaling mean?', options: ['Adding more power to one server', 'Adding more servers', 'Reducing server resources', 'Changing database'], correctIndex: 1 },
      { question: 'Which is a popular Node.js hosting platform?', options: ['GitHub', 'Vercel', 'Heroku', 'All of the above'], correctIndex: 2 },
      { question: 'What should you use for sensitive data?', options: ['Hardcoded values', 'Environment variables', 'Comments', 'Logs'], correctIndex: 1 },
    ],
  },
];

// Full Stack Developer Curriculum
const fullstackWeeks: WeekTemplate[] = [
  {
    title: 'Week 1: Full Stack Setup & Fundamentals',
    description: 'Set up development environment for full stack development',
    concepts: [
      { title: 'Frontend & Backend Architecture', description: 'Understand full stack architecture, client-server communication, and separation of concerns.', videoId: 'Pq8wg_EpXPQ', videoRequiredSeconds: 120, practiceTask: 'Design a simple full stack application architecture. Create diagrams showing frontend, backend, database, and API communication.' },
      { title: 'Development Environment Setup', description: 'Configure development environment with Node.js, database, and frontend tools.', videoId: 'V4nv4Y_DYBY', videoRequiredSeconds: 120, practiceTask: 'Set up a development environment with Node.js backend, React frontend, and SQL database. Use Docker to containerize everything.' },
      { title: 'Frontend-Backend Integration', description: 'Connect frontend applications to backend APIs.', videoId: 'Y8q5eRaQUfY', videoRequiredSeconds: 120, practiceTask: 'Build a React component that fetches data from a Node.js API. Handle loading states, errors, and display data dynamically.' },
    ],
    testQuestions: [
      { question: 'What is the role of the backend in full stack?', options: ['Display UI', 'Process business logic and manage data', 'Style the website', 'Send emails'], correctIndex: 1 },
      { question: 'What does the frontend communicate with?', options: ['Database directly', 'Backend API', 'File system', 'Email server'], correctIndex: 1 },
      { question: 'What is Docker used for?', options: ['Styling', 'Containerization', 'Testing', 'Logging'], correctIndex: 1 },
      { question: 'Which protocol is used for frontend-backend communication?', options: ['FTP', 'HTTP/HTTPS', 'SSH', 'SMTP'], correctIndex: 1 },
      { question: 'What is a development environment?', options: ['Production server', 'Local setup for development', 'Cloud service', 'Database server'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 2: React Frontend with Backend Integration',
    description: 'Build React applications that communicate with backend',
    concepts: [
      { title: 'React Components & State Management', description: 'Build reusable React components with proper state management for full stack apps.', videoId: 'dQw4w9WgXcQ', videoRequiredSeconds: 120, practiceTask: 'Create a React app with multiple components that share state. Use Context API or Redux for state management.' },
      { title: 'API Integration in React', description: 'Fetch data from backend APIs and handle loading, error, and success states.', videoId: 'gZ_L3RYpeFQ', videoRequiredSeconds: 120, practiceTask: 'Build a component that fetches data from your backend API. Implement error handling, loading indicators, and real-time updates.' },
      { title: 'Authentication Flow', description: 'Implement user login, token management, and protected routes.', videoId: 'mFxMj2ZDGtU', videoRequiredSeconds: 120, practiceTask: 'Implement JWT authentication in React. Create login/signup forms, store tokens securely, and protect routes.' },
    ],
    testQuestions: [
      { question: 'How do you fetch data from an API in React?', options: ['Direct database access', 'fetch() or axios', 'localStorage only', 'HTML forms'], correctIndex: 1 },
      { question: 'What is state management in React?', options: ['Managing file systems', 'Managing component data', 'Managing servers', 'Managing databases'], correctIndex: 1 },
      { question: 'Where should tokens be stored', options: ['Plain JavaScript variable', 'localStorage with caution', 'httpOnly cookies', 'All of above'], correctIndex: 2 },
      { question: 'What is a protected route?', options: ['A route with HTTPS', 'A route that requires authentication', 'A cached route', 'A route with CORS'], correctIndex: 1 },
      { question: 'How do you handle API errors in React?', options: ['Ignore them', 'Use try-catch', 'Use .catch() on Promises', 'All of above'], correctIndex: 2 },
    ],
  },
  {
    title: 'Week 3: Database Integration & Data Flow',
    description: 'Connect frontend and backend through databases',
    concepts: [
      { title: 'Database Design for Applications', description: 'Design databases that support full stack applications with normalized schemas.', videoId: 'v4BQwARL_5g', videoRequiredSeconds: 120, practiceTask: 'Design a database for a social media app. Include users, posts, comments, and relationships. Normalize the schema.' },
      { title: 'ORM & Data Validation', description: 'Use ORMs like Sequelize to interact with databases and validate data.', videoId: '4v-HRDsKwi8', videoRequiredSeconds: 120, practiceTask: 'Use Sequelize to define models with validation. Create associations between models and implement data validation.' },
      { title: 'Real-time Data Updates', description: 'Implement real-time data synchronization between frontend and backend.', videoId: 'wngES73IHvY', videoRequiredSeconds: 120, practiceTask: 'Implement WebSocket or Server-Sent Events to push data updates to frontend. Update React components in real-time.' },
    ],
    testQuestions: [
      { question: 'What is an ORM?', options: ['A database', 'Object-Relational Mapping', 'A front-end library', 'A testing tool'], correctIndex: 1 },
      { question: 'What is data validation?', options: ['Encrypting data', 'Ensuring data meets requirements', 'Backing up data', 'Deleting old data'], correctIndex: 1 },
      { question: 'What are WebSockets used for?', options: ['HTTP requests', 'Real-time bidirectional communication', 'File uploads', 'Email sending'], correctIndex: 1 },
      { question: 'What is normalization in databases?', options: ['Organizing data efficiently', 'Encrypting data', 'Compressing data', 'Validating data'], correctIndex: 0 },
      { question: 'How do you prevent N+1 queries?', options: ['Use caching', 'Use JOIN queries', 'Use eager loading', 'All of above'], correctIndex: 2 },
    ],
  },
  {
    title: 'Week 4: Full Stack Architecture Patterns',
    description: 'Architect scalable full stack applications',
    concepts: [
      { title: 'Client-Server Architecture', description: 'Understand different architectural patterns for full stack applications.', videoId: 'oXOb-pAGc8Y', videoRequiredSeconds: 120, practiceTask: 'Design multiple architectures: monolithic, microservices, and serverless. Compare pros/cons of each.' },
      { title: 'API Design Best Practices', description: 'Design APIs that are efficient, secure, and easy to use.', videoId: 'YKG1dN8qm8A', videoRequiredSeconds: 120, practiceTask: 'Design RESTful APIs following best practices. Use proper HTTP methods, status codes, versioning, and pagination.' },
      { title: 'Frontend Optimization', description: 'Optimize frontend performance with code splitting, lazy loading, and caching.', videoId: 'e0fC5q94Fvk', videoRequiredSeconds: 120, practiceTask: 'Optimize React app with code splitting, lazy loading routes, and image optimization. Measure Lighthouse score improvements.' },
    ],
    testQuestions: [
      { question: 'What is a monolithic architecture?', options: ['Multiple services', 'Single unified application', 'Serverless functions', 'Microcontainers'], correctIndex: 1 },
      { question: 'What are microservices?', options: ['Small functions', 'Independent services working together', 'Containerized apps', 'Partially deployed apps'], correctIndex: 1 },
      { question: 'What is API versioning?', options: ['Using version numbers in API', 'Using dates', 'Not necessary', 'Only for major changes'], correctIndex: 0 },
      { question: 'What is code splitting?', options: ['Splitting files by lines', 'Breaking code into chunks loaded on demand', 'Separating frontend and backend', 'Dividing by functions'], correctIndex: 1 },
      { question: 'What does lazy loading mean?', options: ['Slow loading', 'Loading on demand', 'Not loading', 'Background loading'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 5: Testing Across the Stack',
    description: 'Implement comprehensive testing strategies',
    concepts: [
      { title: 'Frontend Testing', description: 'Write unit and integration tests for React components using React Testing Library.', videoId: 'Aa-chr16SPE', videoRequiredSeconds: 120, practiceTask: 'Write comprehensive tests for React components. Test user interactions, state changes, and API calls with mocks.' },
      { title: 'Backend Testing', description: 'Test Node.js APIs with Jest and test databases.', videoId: 'h5r5v15KdWc', videoRequiredSeconds: 120, practiceTask: 'Write API tests covering all endpoints. Test error cases, authentication, and database operations.' },
      { title: 'End-to-End Testing', description: 'Test complete user workflows with tools like Cypress or Playwright.', videoId: 'nz7a8XCy6W8', videoRequiredSeconds: 120, practiceTask: 'Write E2E tests for critical user flows. Test login, data submission, and navigation across full stack app.' },
    ],
    testQuestions: [
      { question: 'What is React Testing Library used for?', options: ['Component styling', 'Testing React components', 'State management', 'API calls'], correctIndex: 1 },
      { question: 'What is an E2E test?', options: ['Individual function test', 'Testing entire user workflow', 'Database test', 'Server test'], correctIndex: 1 },
      { question: 'What should you mock in tests?', options: ['Nothing', 'External APIs', 'DOM elements', 'CSS'], correctIndex: 1 },
      { question: 'What is test coverage?', options: ['Testing speed', 'Percentage of code tested', 'Number of tests', 'Test duration'], correctIndex: 1 },
      { question: 'When should you write tests?', options: ['After deployment', 'During development', 'Only for bugs', 'Never'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 6: Full Stack Capstone & Deployment',
    description: 'Build and deploy a complete full stack application',
    concepts: [
      { title: 'Project Planning & Architecture', description: 'Plan and design a complex full stack application.', videoId: 'YqVWvVBv3sY', videoRequiredSeconds: 120, practiceTask: 'Create project plan with user stories, data model, API design, and component structure for a full stack app.' },
      { title: 'Building the Capstone Project', description: 'Implement frontend and backend features of your capstone project.', videoId: 'TEpFqGF0DlE', videoRequiredSeconds: 120, practiceTask: 'Build a complete full stack application with authentication, CRUD operations, and business logic.' },
      { title: 'Full Stack Deployment', description: 'Deploy full stack applications to production platforms.', videoId: 'kBLuVXVHI10', videoRequiredSeconds: 120, practiceTask: 'Deploy frontend to Vercel/Netlify and backend to Heroku/AWS. Set up databases, environment variables, and CI/CD.' },
    ],
    testQuestions: [
      { question: 'What is a user story?', options: ['A story in code', 'A description of a feature from user perspective', 'A database record', 'A test case'], correctIndex: 1 },
      { question: 'What should a README include?', options: ['Only title', 'Setup, features, tech stack, deployment', 'Just license', 'Nothing'], correctIndex: 1 },
      { question: 'What is environment configuration?', options: ['CSS settings', 'Managing secrets and settings per environment', 'Browser settings', 'OS settings'], correctIndex: 1 },
      { question: 'Which platforms support full stack deployment?', options: ['AWS', 'Vercel', 'Heroku', 'All of above'], correctIndex: 2 },
      { question: 'What is a production database?', options: ['Personal database', 'Real user data database', 'Test database', 'Local database'], correctIndex: 1 },
    ],
  },
];

// Data Scientist Curriculum
const dataScientistWeeks: WeekTemplate[] = [
  {
    title: 'Week 1: Python & Data Fundamentals',
    description: 'Master Python programming for data science',
    concepts: [
      { title: 'Python Basics for Data', description: 'Learn Python programming with NumPy for numerical computing.', videoId: '_uQrJ0TkZlc', videoRequiredSeconds: 120, practiceTask: 'Write Python programs with lists, dictionaries, and NumPy arrays. Perform basic numerical operations and array manipulations.' },
      { title: 'Data Structures & Algorithms', description: 'Understand data structures commonly used in data science and efficient algorithms.', videoId: 'pkYVOmU96JU', videoRequiredSeconds: 120, practiceTask: 'Implement stacks, queues, and hash tables. Sort arrays and search data efficiently.' },
      { title: 'Working with CSV and Data Files', description: 'Read and write different data file formats commonly used in data science.', videoId: 'xi0__dINzEc', videoRequiredSeconds: 120, practiceTask: 'Load data from CSV, JSON, and Excel files. Transform data into appropriate formats for analysis.' },
    ],
    testQuestions: [
      { question: 'What is NumPy used for?', options: ['Web framework', 'Numerical computing', 'Data visualization', 'Database'], correctIndex: 1 },
      { question: 'What is a data structure?', options: ['A database', 'A way to organize data', 'A file format', 'A visualization'], correctIndex: 1 },
      { question: 'What format is most common for tabular data?', options: ['JSON', 'XML', 'CSV', 'HTML'], correctIndex: 2 },
      { question: 'What does a hash table do?', options: ['Stores hashes', 'Maps keys to values efficiently', 'Encrypts data', 'Sorts data'], correctIndex: 1 },
      { question: 'What is the time complexity of linear search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 2 },
    ],
  },
  {
    title: 'Week 2: Data Analysis with Pandas',
    description: 'Analyze data using Pandas and SQL',
    concepts: [
      { title: 'Pandas DataFrames', description: 'Learn to manipulate data with Pandas DataFrames and Series.', videoId: 'zvKkUwtFsKc', videoRequiredSeconds: 120, practiceTask: 'Load datasets and create DataFrames. Select, filter, and transform data using Pandas operations.' },
      { title: 'Data Cleaning & Preprocessing', description: 'Handle missing data, outliers, and prepare data for analysis.', videoId: 'PjDT-lZX_yA', videoRequiredSeconds: 120, practiceTask: 'Clean messy datasets: handle missing values, remove duplicates, fix data types, normalize data.' },
      { title: 'SQL for Data Analysis', description: 'Query databases using SQL to extract and analyze data.', videoId: 'HXV3zeQKqGY', videoRequiredSeconds: 120, practiceTask: 'Write complex SQL queries with joins, aggregations, and subqueries to answer business questions.' },
    ],
    testQuestions: [
      { question: 'What is a DataFrame?', options: ['A border around data', 'A tabular data structure', 'A graph', 'A type of algorithm'], correctIndex: 1 },
      { question: 'What is missing data', options: ['Deleted data', 'Incomplete or null values', 'Encrypted data', 'Remote data'], correctIndex: 1 },
      { question: 'What is normalization?', options: ['Making data normal', 'Scaling features to similar ranges', 'Sorting data', 'Removing data'], correctIndex: 1 },
      { question: 'What does GROUP BY do in SQL?', options: ['Joins tables', 'Aggregates data by categories', 'Orders data', 'Counts rows'], correctIndex: 1 },
      { question: 'What is an outlier?', options: ['Normal data point', 'Unusual data point', 'Missing value', 'Duplicate'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 3: Data Visualization',
    description: 'Visualize data insights with various tools',
    concepts: [
      { title: 'Matplotlib & Seaborn', description: 'Create static visualizations with Matplotlib and Seaborn.', videoId: 'wDH-mLiLc1E', videoRequiredSeconds: 120, practiceTask: 'Create line plots, scatter plots, histograms, and box plots. Customize colors, labels, and styles.' },
      { title: 'Interactive Visualizations', description: 'Build interactive visualizations with Plotly and Dash.', videoId: 'r4J6KrZHe0A', videoRequiredSeconds: 120, practiceTask: 'Create interactive dashboards with Plotly. Build choropleth maps and 3D visualizations.' },
      { title: 'Storytelling with Data', description: 'Present data insights effectively through visualization design.', videoId: 'MpDkWrjCLF8', videoRequiredSeconds: 120, practiceTask: 'Create a data story with multiple visualizations. Annotate charts and guide viewer through insights.' },
    ],
    testQuestions: [
      { question: 'What is Matplotlib?', options: ['A math library', 'A plotting library', 'A testing tool', 'A database'], correctIndex: 1 },
      { question: 'What is Seaborn built on?', options: ['Plotly', 'Bokeh', 'Matplotlib', 'Dash'], correctIndex: 2 },
      { question: 'Which visualization is best for distributions?', options: ['Line plot', 'Histogram', 'Pie chart', 'Heatmap'], correctIndex: 1 },
      { question: 'What is a heatmap used for?', options: ['Temperature data', 'Correlations and patterns', 'Time series', 'Categorical data'], correctIndex: 1 },
      { question: 'What makes a good visualization?', options: ['Complex', 'Clear, accurate, and actionable', 'Colorful', 'Detailed'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 4: Statistical Analysis',
    description: 'Analyze data with statistical methods',
    concepts: [
      { title: 'Descriptive Statistics', description: 'Calculate and interpret statistical measures of data.', videoId: 'nXmVJXb1Dxw', videoRequiredSeconds: 120, practiceTask: 'Calculate mean, median, mode, variance, and standard deviation. Create summary statistics tables.' },
      { title: 'Probability & Distributions', description: 'Understand probability distributions and statistical tests.', videoId: 'oI3pLKbqW_c', videoRequiredSeconds: 120, practiceTask: 'Identify data distributions. Perform hypothesis tests: t-test, chi-square, ANOVA.' },
      { title: 'Correlation & Regression', description: 'Analyze relationships between variables using correlation and regression.', videoId: 'owZbGPeXWfM', videoRequiredSeconds: 120, practiceTask: 'Calculate correlations, create correlation matrix. Build linear and multiple regression models.' },
    ],
    testQuestions: [
      { question: 'What is standard deviation?', options: ['Average value', 'Measure of spread', 'Most common value', 'Median value'], correctIndex: 1 },
      { question: 'What is a hypothesis test?', options: ['Testing a website', 'Statistical test of assumptions', 'Testing code', 'Data validation'], correctIndex: 1 },
      { question: 'What does correlation measure?', options: ['Causation', 'Linear relationship strength', 'Data quality', 'Sample size'], correctIndex: 1 },
      { question: 'What does R² represent in regression?', options: ['Correlation coefficient', 'Coefficient of determination', 'Residuals', 'Regression line'], correctIndex: 1 },
      { question: 'What is statistical significance?', options: ['Large sample', 'Result unlikely due to chance', 'High correlation', 'Large variance'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 5: Machine Learning Basics',
    description: 'Introduction to machine learning algorithms',
    concepts: [
      { title: 'Supervised Learning', description: 'Build models with labeled data: classification and regression.', videoId: 'aircAruvnKk', videoRequiredSeconds: 120, practiceTask: 'Build decision trees, random forests, and SVM models. Evaluate with accuracy, precision, recall, F1-score.' },
      { title: 'Unsupervised Learning', description: 'Find patterns in unlabeled data: clustering and dimensionality reduction.', videoId: 'ye7U0wXqCjQ', videoRequiredSeconds: 120, practiceTask: 'Implement K-means clustering, hierarchical clustering. Perform PCA for dimensionality reduction.' },
      { title: 'Model Evaluation & Validation', description: 'Evaluate machine learning models and avoid overfitting.', videoId: 'KwfqL1p_eqo', videoRequiredSeconds: 120, practiceTask: 'Use cross-validation to evaluate models. Create ROC curves and confusion matrices. Tune hyperparameters.' },
    ],
    testQuestions: [
      { question: 'What is supervised learning?', options: ['Learning without labels', 'Learning with labeled data', 'Self-learning', 'Group learning'], correctIndex: 1 },
      { question: 'What algorithm classifies data into groups?', options: ['Linear regression', 'K-means clustering', 'PCA', 'Decision tree'], correctIndex: 2 },
      { question: 'What is overfitting?', options: ['Too much fitting', 'Model fits training data but fails on test data', 'Not enough features', 'Too many features'], correctIndex: 1 },
      { question: 'What is cross-validation?', options: ['Validating across countries', 'Splitting data for model evaluation', 'Comparing models', 'Testing validity'], correctIndex: 1 },
      { question: 'What does precision measure?', options: ['Accuracy of all predictions', 'Accuracy of positive predictions', 'Model speed', 'Memory usage'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 6: Capstone Data Science Project',
    description: 'Complete a full data science project',
    concepts: [
      { title: 'Problem Definition & Exploration', description: 'Define problems, explore data, and form hypotheses.', videoId: 'C_S7C1VgJ-k', videoRequiredSeconds: 120, practiceTask: 'Select a dataset, perform exploratory data analysis (EDA), identify patterns, and form research questions.' },
      { title: 'Building ML Pipeline', description: 'Create end-to-end machine learning pipeline from data to predictions.', videoId: 'ZJhfMwCEYYs', videoRequiredSeconds: 120, practiceTask: 'Build pipeline: data loading, preprocessing, feature engineering, model training, evaluation, and optimization.' },
      { title: 'Communicating Results', description: 'Present findings through reports and visualizations.', videoId: '8Yd5SAEcjUo', videoRequiredSeconds: 120, practiceTask: 'Create comprehensive analysis report with visualizations, statistical tests, model performance metrics, and business insights.' },
    ],
    testQuestions: [
      { question: 'What is EDA?', options: ['A technique', 'Exploratory Data Analysis', 'A database', 'A hypothesis'], correctIndex: 1 },
      { question: 'What is a data pipeline?', options: ['A physical pipe', 'Sequence of data processing steps', 'A visualization', 'A database'], correctIndex: 1 },
      { question: 'What is feature engineering?', options: ['Building features', 'Creating meaningful features from raw data', 'Software features', 'Application features'], correctIndex: 1 },
      { question: 'What should a report include?', options: ['Only results', 'Methods, results, visualizations, insights', 'Technical details', 'Code only'], correctIndex: 1 },
      { question: 'What is RMSE?', options: ['Model type', 'Root Mean Squared Error', 'Regression method', 'Random value'], correctIndex: 1 },
    ],
  },
];

// ML Engineer Curriculum
const mlEngineerWeeks: WeekTemplate[] = [
  {
    title: 'Week 1: Machine Learning Foundations',
    description: 'Understand ML fundamentals and math',
    concepts: [
      { title: 'Linear Algebra Essentials', description: 'Master matrix operations and linear algebra for ML.', videoId: '0oqPlFZJ6C0', videoRequiredSeconds: 120, practiceTask: 'Implement matrix operations: multiplication, transpose, inverse. Use numpy for linear algebra.' },
      { title: 'Calculus for ML', description: 'Understand gradients, derivatives, and optimization.', videoId: 'WUvTWYJt-es', videoRequiredSeconds: 120, practiceTask: 'Compute derivatives and gradients. Implement gradient descent from scratch.' },
      { title: 'Probability & Statistics for ML', description: 'Apply probability and statistics to machine learning.', videoId: 'Sk6ivHZcyPk', videoRequiredSeconds: 120, practiceTask: 'Calculate probability distributions, perform Bayesian analysis, and understand likelihood.' },
    ],
    testQuestions: [
      { question: 'What is a gradient?', options: ['A color change', 'Direction of steepest increase', 'A descent', 'A slope'], correctIndex: 1 },
      { question: 'What is gradient descent?', options: ['A mountain', 'Optimization algorithm', 'A descent method', 'A cost function'], correctIndex: 1 },
      { question: 'What is a matrix?', options: ['A movie', '2D array of numbers', 'A transformation', 'A linear combination'], correctIndex: 1 },
      { question: 'What is chain rule in calculus?', options: ['A rule for chains', 'Method to compute derivatives of composed functions', 'A calculus proof', 'A differential equation'], correctIndex: 1 },
      { question: 'What is Bayes theorem?', options: ['Probability formula', 'P(A|B) = P(B|A)P(A)/P(B)', 'A statistical test', 'A Bayesian network'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 2: Supervised Learning Algorithms',
    description: 'Master classification and regression models',
    concepts: [
      { title: 'Regression Models', description: 'Build linear, polynomial, and ridge regression models.', videoId: 'aq8Hn2nGMWk', videoRequiredSeconds: 120, practiceTask: 'Implement linear regression with scikit-learn, create polynomial features, and apply regularization.' },
      { title: 'Classification Algorithms', description: 'Implement logistic regression, SVM, and decision trees.', videoId: 'HLGXVN_TzqI', videoRequiredSeconds: 120, practiceTask: 'Build classification models, create confusion matrices, and evaluate performance metrics.' },
      { title: 'Ensemble Methods', description: 'Combine multiple models with Random Forests and Gradient Boosting.', videoId: 'weVAN2a7P-4', videoRequiredSeconds: 120, practiceTask: 'Implement Random Forests and XGBoost. Compare with single models and tune hyperparameters.' },
    ],
    testQuestions: [
      { question: 'What does logistic regression predict?', options: ['Continuous values', 'Probabilities for classification', 'Categories', 'Clusters'], correctIndex: 1 },
      { question: 'What is SVM?', options: ['A database', 'Support Vector Machine', 'A neural network', 'A clustering method'], correctIndex: 1 },
      { question: 'What are ensemble methods?', options: ['Single models', 'Combining multiple models', 'Testing methods', 'Validation techniques'], correctIndex: 1 },
      { question: 'What is XGBoost?', options: ['A neural network', 'Gradient boosting library', 'A database', 'A visualization tool'], correctIndex: 1 },
      { question: 'What does regularization prevent?', options: ['Underfitting', 'Overfitting', 'Model bias', 'Data leakage'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 3: Unsupervised Learning & Dimensionality Reduction',
    description: 'Find patterns and reduce data complexity',
    concepts: [
      { title: 'Clustering Algorithms', description: 'Implement K-means, hierarchical, and DBSCAN clustering.', videoId: 'FJ31_MfPa8Y', videoRequiredSeconds: 120, practiceTask: 'Implement K-means, determine optimal clusters with elbow method, visualize clusters.' },
      { title: 'Dimensionality Reduction', description: 'Reduce features with PCA, t-SNE, and autoencoders.', videoId: 'HFe7FXc3JCU', videoRequiredSeconds: 120, practiceTask: 'Apply PCA to high-dimensional data, visualize with t-SNE, implement simple autoencoder.' },
      { title: 'Anomaly Detection', description: 'Detect outliers and anomalies in data.', videoId: 'OfKnj1dECno', videoRequiredSeconds: 120, practiceTask: 'Implement isolation forests and one-class SVM. Detect anomalies in time series and tabular data.' },
    ],
    testQuestions: [
      { question: 'What is K-means?', options: ['Neural network', 'Clustering algorithm', 'Regression model', 'Classification method'], correctIndex: 1 },
      { question: 'What does PCA do?', options: ['Predicts values', 'Reduces dimensions', 'Classifies data', 'Clusters data'], correctIndex: 1 },
      { question: 'What is t-SNE used for?', options: ['Regression', 'Visualization of high-dimensional data', 'Clustering', 'Classification'], correctIndex: 1 },
      { question: 'What is an autoencoder?', options: ['A decoder', 'Neural network for feature learning', 'An encoder', 'A compression tool'], correctIndex: 1 },
      { question: 'What is an anomaly?', options: ['A normal point', 'An unusual/outlier point', 'A feature', 'A cluster'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 4: Deep Learning & Neural Networks',
    description: 'Build complex neural network models',
    concepts: [
      { title: 'Neural Network Basics', description: 'Understand perceptrons, activation functions, and backpropagation.', videoId: 'IHZwWFHWa-w', videoRequiredSeconds: 120, practiceTask: 'Build neural networks with TensorFlow/Keras. Implement different activation functions and train on datasets.' },
      { title: 'CNNs for Computer Vision', description: 'Build Convolutional Neural Networks for image processing.', videoId: 'HGwBXDKFk9I', videoRequiredSeconds: 120, practiceTask: 'Create CNN for image classification, implement transfer learning with pre-trained models.' },
      { title: 'RNNs & Sequence Models', description: 'Build LSTMs and transformers for sequential data.', videoId: 'W2ZE8DHsRZo', videoRequiredSeconds: 120, practiceTask: 'Implement LSTMs for time series, RNNs for NLP, and attention mechanisms.' },
    ],
    testQuestions: [
      { question: 'What is backpropagation?', options: ['Forward pass', 'Algorithm for training neural networks', 'A neural structure', 'A cost function'], correctIndex: 1 },
      { question: 'What is an activation function?', options: ['Debugging function', 'Introduces non-linearity', 'A loss function', 'An optimizer'], correctIndex: 1 },
      { question: 'What is a CNN?', options: ['A television channel', 'Convolutional Neural Network', 'A neural layer', 'A pooling method'], correctIndex: 1 },
      { question: 'What does LSTM solve?', options: ['Overfitting', 'Vanishing gradient problem', 'Underfitting', 'High variance'], correctIndex: 1 },
      { question: 'What is a transformer?', options: ['A device', 'Neural architecture with attention', 'A layer type', 'An activation function'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 5: Model Deployment & MLOps',
    description: 'Deploy and maintain ML models',
    concepts: [
      { title: 'Model Serialization & APIs', description: 'Save models and expose them as APIs.', videoId: 'CGzN0p8JGPI', videoRequiredSeconds: 120, practiceTask: 'Save trained models with pickle/joblib, create Flask API to serve predictions.' },
      { title: 'Containerization & Deployment', description: 'Deploy models with Docker and on cloud platforms.', videoId: 'XO6cYt0r9rA', videoRequiredSeconds: 120, practiceTask: 'Create Docker container for ML model, deploy to AWS/GCP/Azure, handle model versioning.' },
      { title: 'Monitoring & Model Maintenance', description: 'Monitor model performance and retrain when needed.', videoId: 'L2VQdTnwjNI', videoRequiredSeconds: 120, practiceTask: 'Set up monitoring for prediction drift, implement retraining pipelines, track model metrics.' },
    ],
    testQuestions: [
      { question: 'What is model serialization?', options: ['Saving in order', 'Saving model to file', 'Splitting model', 'Compressing model'], correctIndex: 1 },
      { question: 'What is Docker?', options: ['A shipping container', 'Containerization tool', 'A virtual machine', 'Cloud service'], correctIndex: 1 },
      { question: 'What is model drift?', options: ['Model performance change', 'Data distribution change', 'Prediction divergence', 'All of above'], correctIndex: 2 },
      { question: 'What is MLOps?', options: ['Machine learning operations', 'ML testing', 'ML modeling', 'ML algorithms'], correctIndex: 0 },
      { question: 'When should you retrain a model?', options: ['Never', 'When performance degrades', 'Randomly', 'Daily'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 6: Advanced ML & Capstone Project',
    description: 'Build cutting-edge ML solutions',
    concepts: [
      { title: 'Transfer Learning & Fine-tuning', description: 'Leverage pre-trained models for custom tasks.', videoId: 'yofjFQddwHE', videoRequiredSeconds: 120, practiceTask: 'Fine-tune BERT for text classification, use ResNet50 for custom image classification.' },
      { title: 'Federated Learning & Privacy', description: 'Build ML systems with privacy preservation.', videoId: '3dZwdzYVVr4', videoRequiredSeconds: 120, practiceTask: 'Implement federated learning, add differential privacy, protect sensitive data.' },
      { title: 'ML Capstone Project', description: 'Build an end-to-end ML solution addressing a real problem.', videoId: 'aBMPQSdDKow', videoRequiredSeconds: 120, practiceTask: 'Build complete ML pipeline: problem definition, data collection, EDA, feature engineering, modeling, evaluation, deployment.' },
    ],
    testQuestions: [
      { question: 'What is transfer learning?', options: ['Moving models', 'Reusing pre-trained models', 'Training transfer', 'Model migration'], correctIndex: 1 },
      { question: 'What is fine-tuning?', options: ['Adjusting parameters', 'Training pre-trained model on custom data', 'Hyperparameter tuning', 'Model optimization'], correctIndex: 1 },
      { question: 'What is federated learning', options: ['Federal systems', 'Distributed ML without sharing data', 'Group learning', 'Cloud learning'], correctIndex: 1 },
      { question: 'What is differential privacy?', options: ['Privacy for other uses', 'Protecting individual privacy in datasets', 'Password privacy', 'Data privacy'], correctIndex: 1 },
      { question: 'What is production ML?', options: ['Manufacturing ML', 'Deploying ML in production systems', 'Creating data', 'Training models'], correctIndex: 1 },
    ],
  },
];

// DevOps Engineer Curriculum
const devopsWeeks: WeekTemplate[] = [
  {
    title: 'Week 1: Linux & Bash Fundamentals',
    description: 'Master Linux operating system and shell scripting',
    concepts: [
      { title: 'Linux Basics', description: 'Understand Linux file system, permissions, and basic commands.', videoId: 'ZtqBQ68cfJc', videoRequiredSeconds: 120, practiceTask: 'Navigate file system, manage files and directories, understand permissions. Use ls, cd, mkdir, cp, rm commands.' },
      { title: 'Bash Scripting', description: 'Write shell scripts to automate tasks.', videoId: 'e7BufAVwDiM', videoRequiredSeconds: 120, practiceTask: 'Write bash scripts with variables, loops, conditionals, and functions. Automate common system administration tasks.' },
      { title: 'Package Management & Services', description: 'Install software and manage system services.', videoId: 'ZsjK4VDopiE', videoRequiredSeconds: 120, practiceTask: 'Use apt/yum to install packages, manage services with systemctl, understand dependencies.' },
    ],
    testQuestions: [
      { question: 'What is Linux?', options: ['A brand', 'An operating system kernel', 'A programming language', 'A database'], correctIndex: 1 },
      { question: 'What is bash?', options: ['A python tool', 'A shell scripting language', 'A compiler', 'A database'], correctIndex: 1 },
      { question: 'What do file permissions represent?', options: ['File content', 'Who can read, write, execute', 'File size', 'File location'], correctIndex: 1 },
      { question: 'What is a package manager?', options: ['A person', 'Tool to install and manage software', 'A file system', 'A system service'], correctIndex: 1 },
      { question: 'What is systemctl used for?', options: ['System checks', 'Managing services', 'Compiling code', 'Monitoring resources'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 2: Docker & Containerization',
    description: 'Build and manage containerized applications',
    concepts: [
      { title: 'Docker Fundamentals', description: 'Understand containers, images, and Docker architecture.', videoId: 'fqMOX6JJhGo', videoRequiredSeconds: 120, practiceTask: 'Write Dockerfiles, build images, run containers. Understand layers and image optimization.' },
      { title: 'Docker Compose', description: 'Manage multi-container applications with Docker Compose.', videoId: 'HG6yIjZapSA', videoRequiredSeconds: 120, practiceTask: 'Create docker-compose.yml for multi-container apps. Manage services, volumes, and networks.' },
      { title: 'Container Registry & Best Practices', description: 'Push images to registries and follow container best practices.', videoId: '3c-iBn73dDE', videoRequiredSeconds: 120, practiceTask: 'Push images to Docker Hub/ECR, use private registries, implement image scanning and signing.' },
    ],
    testQuestions: [
      { question: 'What is Docker?', options: ['A shipping company', 'Containerization platform', 'A database', 'A web server'], correctIndex: 1 },
      { question: 'What is a container?', options: ['A box', 'Lightweight isolated process', 'Virtual machine', 'A storage unit'], correctIndex: 1 },
      { question: 'What is a Docker image?', options: ['A picture', 'Blueprint for creating containers', 'A container', 'A file system'], correctIndex: 1 },
      { question: 'What is Docker Compose?', options: ['A music tool', 'Tool for multi-container orchestration', 'A static tool', 'A monitoring tool'], correctIndex: 1 },
      { question: 'What is a Dockerfile?', options: ['A data file', 'Instructions to build Docker image', 'A configuration file', 'A shell script'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 3: Kubernetes Basics',
    description: 'Orchestrate containerized applications at scale',
    concepts: [
      { title: 'Kubernetes Architecture', description: 'Understand Kubernetes cluster components and architecture.', videoId: 'X48VuDVv0Z0', videoRequiredSeconds: 120, practiceTask: 'Deploy Kubernetes cluster locally (minikube), understand nodes, pods, and clusters.' },
      { title: 'Kubernetes Objects', description: 'Work with pods, deployments, services, and ingress.', videoId: 'h3E2zCmLo20', videoRequiredSeconds: 120, practiceTask: 'Create Kubernetes manifests for deployments, services, and configmaps. Deploy applications.' },
      { title: 'Scaling & High Availability', description: 'Configure auto-scaling and ensure application availability.', videoId: 'cRPxLHBwxKI', videoRequiredSeconds: 120, practiceTask: 'Set up horizontal pod autoscaling, manage rolling updates, handle pod disruption budgets.' },
    ],
    testQuestions: [
      { question: 'What is Kubernetes?', options: ['A container', 'Container orchestration platform', 'A database', 'A monitoring tool'], correctIndex: 1 },
      { question: 'What is a pod?', options: ['A small boat', 'Smallest Kubernetes unit', 'A container', 'A deployment'], correctIndex: 1 },
      { question: 'What is a Deployment?', options: ['Sending apps', 'Kubernetes object managing replicas', 'A service', 'A manifest'], correctIndex: 1 },
      { question: 'What is a Service in Kubernetes?', options: ['A task', 'Network abstraction for pods', 'A pod', 'An ingress'], correctIndex: 1 },
      { question: 'What is auto-scaling?', options: ['Manual scaling', 'Automatically adjusting pod count', 'Load balancing', 'Network scaling'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 4: CI/CD Pipelines',
    description: 'Automate build, test, and deployment',
    concepts: [
      { title: 'CI/CD Concepts & Tools', description: 'Understand continuous integration and deployment pipelines.', videoId: 'scEDHsr3APU', videoRequiredSeconds: 120, practiceTask: 'Set up CI/CD pipeline with GitHub Actions, GitLab CI, or Jenkins.' },
      { title: 'GitHub Actions', description: 'Build automated workflows with GitHub Actions.', videoId: 'DhZjIYT0eMU', videoRequiredSeconds: 120, practiceTask: 'Create workflow files for testing, building, and deploying. Implement matrix builds and caching.' },
      { title: 'Jenkins & Advanced Pipelines', description: 'Create complex pipelines with Jenkins.', videoId: 'q7dOqouLp1Q', videoRequiredSeconds: 120, practiceTask: 'Build Jenkins declarative pipelines, implement groovy scripts, handle environment variables.' },
    ],
    testQuestions: [
      { question: 'What is CI/CD?', options: ['Customer Interaction', 'Continuous Integration/Deployment', 'Code Integration', 'Continuous Development'], correctIndex: 1 },
      { question: 'What does CI do?', options: ['Deploys code', 'Automatically tests and builds', 'Runs tests only', 'Manages servers'], correctIndex: 1 },
      { question: 'What is GitHub Actions?', options: ['A feature request', 'Workflow automation tool', 'A code review tool', 'A deployment tool'], correctIndex: 1 },
      { question: 'What is Jenkins?', options: ['A person', 'Automation server for CI/CD', 'A database', 'A container tool'], correctIndex: 1 },
      { question: 'What should a CI pipeline include?', options: ['Only tests', 'Build, test, quality checks', 'Only builds', 'Only deployment'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 5: Monitoring & Logging',
    description: 'Monitor systems and manage logs',
    concepts: [
      { title: 'Prometheus & Metrics', description: 'Collect and query system metrics with Prometheus.', videoId: 'ydK6q0_5hyI', videoRequiredSeconds: 120, practiceTask: 'Set up Prometheus, define metrics, create alerting rules, query time-series data.' },
      { title: 'ELK Stack & Logging', description: 'Collect and analyze logs with Elasticsearch, Logstash, Kibana.', videoId: 'Kqs7gsjvS5Y', videoRequiredSeconds: 120, practiceTask: 'Deploy ELK stack, configure Logstash for log ingestion, create Kibana dashboards.' },
      { title: 'Observability & Tracing', description: 'Implement distributed tracing and comprehensive observability.', videoId: '9DXeB4E0lL0', videoRequiredSeconds: 120, practiceTask: 'Implement Jaeger for distributed tracing, use OpenTelemetry, correlate logs and traces.' },
    ],
    testQuestions: [
      { question: 'What is Prometheus?', options: ['A movie', 'Metrics collection system', 'A database', 'A logging tool'], correctIndex: 1 },
      { question: 'What do metrics measure?', options: ['Messages', 'System behavior quantitatively', 'Logs', 'Errors'], correctIndex: 1 },
      { question: 'What is the ELK Stack?', options: ['A type of animal', 'Elasticsearch, Logstash, Kibana', 'Error Logging Kit', 'Event Log Keeper'], correctIndex: 1 },
      { question: 'What is distributed tracing?', options: ['Tracking packages', 'Tracing requests across services', 'Logging requests', 'Monitoring traces'], correctIndex: 1 },
      { question: 'What is observability?', options: ['Watching systems', 'Understanding system state from outputs', 'Monitoring only', 'Logging only'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 6: Infrastructure as Code & Capstone',
    description: 'Manage infrastructure with code',
    concepts: [
      { title: 'Terraform', description: 'Manage cloud infrastructure with Terraform.', videoId: '7xngnjfIlK4', videoRequiredSeconds: 120, practiceTask: 'Write Terraform modules, manage AWS/GCP resources, implement state management.' },
      { title: 'Ansible & Configuration Management', description: 'Automate configuration with Ansible.', videoId: 'gIDywsGBqf4', videoRequiredSeconds: 120, practiceTask: 'Write Ansible playbooks, manage multiple servers, implement idempotent configurations.' },
      { title: 'DevOps Capstone Project', description: 'Build complete DevOps infrastructure',  videoId: 'ZX1sHhEQEYk', videoRequiredSeconds: 120, practiceTask: 'Design and implement complete DevOps infrastructure: IaC, CI/CD pipeline, monitoring, logging, and documentation.' },
    ],
    testQuestions: [
      { question: 'What is Infrastructure as Code?', options: ['Building infrastructure', 'Managing infrastructure with code', 'Coding in infrastructure', 'Building code'], correctIndex: 1 },
      { question: 'What is Terraform?', options: ['A planet', 'IaC tool for cloud resources', 'A container tool', 'A monitoring tool'], correctIndex: 1 },
      { question: 'What is Ansible?', options: ['A tool', 'Configuration management tool', 'A container tool', 'A monitoring tool'], correctIndex: 1 },
      { question: 'What is idempotency?', options: ['A word', 'Running same command multiple times gives same result', 'Uniqueness', 'Efficiency'], correctIndex: 1 },
      { question: 'What should DevOps focus on?', options: ['Only development', 'Only operations', 'Collaboration and automation', 'Code only'], correctIndex: 2 },
    ],
  },
];

// Mobile Developer Curriculum  
const mobileWeeks: WeekTemplate[] = [
  {
    title: 'Week 1: Mobile Development Setup & Fundamentals',
    description: 'Set up mobile development environment',
    concepts: [
      { title: 'Native vs Cross-platform', description: 'Understand different mobile development approaches.', videoId: '6-DPRb1meLQ', videoRequiredSeconds: 120, practiceTask: 'Compare native iOS/Android development with React Native and Flutter. Set up development environment.' },
      { title: 'iOS Development Basics', description: 'Learn Swift and iOS development fundamentals.', videoId: 'comQ8-jWzsM', videoRequiredSeconds: 120, practiceTask: 'Create basic iOS app with Swift, understand View Controllers and Navigation.' },
      { title: 'Android Development Basics', description: 'Learn Kotlin and Android development fundamentals.', videoId: 'EExNvohDd8w', videoRequiredSeconds: 120, practiceTask: 'Create basic Android app with Kotlin, understand Activities and Fragments.' },
    ],
    testQuestions: [
      { question: 'What is native mobile development?', options: ['General development', 'Developing for specific platform (iOS/Android)', 'Cross-platform', 'Web development'], correctIndex: 1 },
      { question: 'What is React Native?', options: ['A framework', 'JavaScript-based cross-platform development', 'A native library', 'A mobile OS'], correctIndex: 1 },
      { question: 'What is Kotlin?', options: ['A coffee brand', 'Programming language for Android', 'A Java library', 'A testing tool'], correctIndex: 1 },
      { question: 'What is Swift?', options: ['Fast', 'Apple programming language', 'A framework', 'A protocol'], correctIndex: 1 },
      { question: 'What is a View Controller?', options: ['A control', 'Screen management in iOS', 'A database', 'A network layer'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 2: Mobile UI & User Experience',
    description: 'Build beautiful mobile user interfaces',
    concepts: [
      { title: 'iOS UI Components', description: 'Build user interfaces with UIKit or SwiftUI.', videoId: 'bVf6fMiMaDk', videoRequiredSeconds: 120, practiceTask: 'Create iOS UI with buttons, text fields, tables, and custom views. Implement layout constraints.' },
      { title: 'Android UI Components', description: 'Build user interfaces with Android Views and Compose.', videoId: 'nq7s1FxR-mE', videoRequiredSeconds: 120, practiceTask: 'Create Android UI with Material Design components, layouts, and custom Views.' },
      { title: 'Responsive Design & Orientation', description: 'Handle different screen sizes and orientations.', videoId: 'bJVmrGJXXCU', videoRequiredSeconds: 120, practiceTask: 'Create responsive layouts for different screen sizes and orientations on iOS and Android.' },
    ],
    testQuestions: [
      { question: 'What is SwiftUI?', options: ['A testing tool', 'Declarative UI framework for iOS', 'A database', 'A networking library'], correctIndex: 1 },
      { question: 'What is Material Design?', options: ['Physical material', 'Google design system', 'A component library', 'An animation system'], correctIndex: 1 },
      { question: 'What is a Layout in Android?', options: ['Page design', 'Arranging UI elements', 'A fragment', 'A screen'], correctIndex: 1 },
      { question: 'What is Auto Layout in iOS?', options: ['Automatic scrolling', 'Constraint-based layout system', 'Dynamic typing', 'View controller'], correctIndex: 1 },
      { question: 'What does responsive design mean?', options: ['Quick design', 'Adapts to different screen sizes', 'Reactive programming', 'API responses'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 3: State Management in Mobile',
    description: 'Manage app state effectively',
    concepts: [
      { title: 'iOS State Management', description: 'Manage state with ObservableObject, ViewModel patterns.', videoId: 'VvyXGe-zyAE', videoRequiredSeconds: 120, practiceTask: 'Implement MVVM pattern in iOS with ObservableObject, create shared ViewModels.' },
      { title: 'Android State Management', description: 'Manage state with ViewModel and Jetpack Compose.', videoId: 'oWjNfjz5T_I', videoRequiredSeconds: 120, practiceTask: 'Implement ViewModel in Android, use StateFlow, handle lifecycle-aware state.' },
      { title: 'Local & Remote Data Management', description: 'Cache data locally and sync with remote servers.', videoId: 'P01Hf7-eMWg', videoRequiredSeconds: 120, practiceTask: 'Implement local database with SQLite/Room, synchronize with APIs, handle offline mode.' },
    ],
    testQuestions: [
      { question: 'What is ViewModel?', options: ['A view', 'Manages UI state and logic', 'A model', 'A database'], correctIndex: 1 },
      { question: 'What is MVVM?', options: ['A pattern', 'Model-View-ViewModel architecture', 'A testing framework', 'A UI library'], correctIndex: 1 },
      { question: 'What is Room in Android?', options: ['A physical room', 'SQLite abstraction library', 'A database', 'A storage solution'], correctIndex: 1 },
      { question: 'What is Core Data in iOS?', options: ['Important information', 'ORM for iOS', 'A database', 'A storage framework'], correctIndex: 1 },
      { question: 'What is offline-first?', options: ['No network', 'App works without internet', 'Background processing', 'Data caching'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 4: Native APIs & Sensors',
    description: 'Use device hardware and native features',
    concepts: [
      { title: 'iOS Native APIs', description: 'Access camera, location, contacts, calendar, and more.', videoId: 'L0Sdo5eZWz0', videoRequiredSeconds: 120, practiceTask: 'Implement camera access, location services, and notification permissions in iOS.' },
      { title: 'Android Native APIs', description: 'Use Android sensors and hardware features.', videoId: 'T7Jyly9T5kM', videoRequiredSeconds: 120, practiceTask: 'Access camera, GPS, accelerometer, microphone in Android with proper permissions.' },
      { title: 'Push Notifications', description: 'Implement push notifications on iOS and Android.', videoId: 'IZH9_VUrKFc', videoRequiredSeconds: 120, practiceTask: 'Set up push notifications with APNs (iOS) and FCM (Android), handle notification interactions.' },
    ],
    testQuestions: [
      { question: 'What is APNs?', options: ['Application Programming', 'Apple Push Notification service', 'Application Program', 'API Notification System'], correctIndex: 1 },
      { question: 'What is FCM?', options: ['Framework for Communication', 'Firebase Cloud Messaging', 'File Communication', 'Feature Compatibility Map'], correctIndex: 1 },
      { question: 'What are permissions in mobile?', options: ['Access control', 'User grants for sensitive features', 'Security protocols', 'Privacy settings'], correctIndex: 1 },
      { question: 'What is location access?', options: ['Website location', 'GPS coordinates from device', 'Server location', 'Network location'], correctIndex: 1 },
      { question: 'What should you do before accessing APIs?', options: ['Just use it', 'Request user permissions', 'Check OS version', 'All of above'], correctIndex: 2 },
    ],
  },
  {
    title: 'Week 5: Testing & Performance Optimization',
    description: 'Test and optimize mobile apps',
    concepts: [
      { title: 'Mobile Unit & UI Testing', description: 'Write tests for iOS and Android with XCTest and Espresso.', videoId: 'hRHzFKmP8hg', videoRequiredSeconds: 120, practiceTask: 'Write unit tests and UI tests for iOS and Android apps, use test doubles and mocks.' },
      { title: 'Performance Optimization', description: 'Optimize memory, battery, and network usage.', videoId: 'oTSJLuJDTUU', videoRequiredSeconds: 120, practiceTask: 'Profile app for memory leaks, optimize image loading, reduce battery consumption.' },
      { title: 'App Store Optimization & Analytics', description: 'Prepare app for stores and track user behavior.', videoId: 'yCqWLgEFELw', videoRequiredSeconds: 120, practiceTask: 'Set up analytics with Firebase, optimize app screenshots and descriptions, track user events.' },
    ],
    testQuestions: [
      { question: 'What is Xc Test?', options: ['A test file', 'iOS unit testing framework', 'A testing tool', 'A debugging tool'], correctIndex: 1 },
      { question: 'What is Espresso?', options: ['A coffee', 'Android UI testing framework', 'A testing library', 'A debugging tool'], correctIndex: 1 },
      { question: 'What is profiling?', options: ['Making profiles', 'Measuring app performance', 'Testing code', 'Debugging code'], correctIndex: 1 },
      { question: 'What is memory leak?', options: ['Leak in memory', 'Unused memory not freed', 'RAM failure', 'Disk issue'], correctIndex: 1 },
      { question: 'What does Firebase Analytics provide?', options: ['Analytics data', 'User behavior and event tracking', 'Performance metrics', 'All of above'], correctIndex: 2 },
    ],
  },
  {
    title: 'Week 6: App Store Deployment & Advanced Features',
    description: 'Deploy apps and add advanced features',
    concepts: [
      { title: 'iOS App Store Deployment', description: 'Prepare and submit iOS apps to App Store.', videoId: 'XWqWfJ_eCz8', videoRequiredSeconds: 120, practiceTask: 'Create App Store listing, sign certificates, submit app to App Store, manage app updates.' },
      { title: 'Google Play Deployment', description: 'Prepare and submit Android apps to Google Play.', videoId: 'hP6zxZRCqJo', videoRequiredSeconds: 120, practiceTask: 'Set up Google Play Console, sign APK/AAB, submit to Play Store, manage releases.' },
      { title: 'Capstone Mobile Project', description: 'Build a complete mobile application.', videoId: 'Q5gQC5wm97Q', videoRequiredSeconds: 120, practiceTask: 'Build complete iOS/Android app with multiple screens, APIs, local storage, testing, and deployment.' },
    ],
    testQuestions: [
      { question: 'What is code signing?', options: ['Signing code changes', 'Cryptographic verification of app', 'Git signing', 'Comment signing'], correctIndex: 1 },
      { question: 'What is an APK?', options: ['A tool', 'Android Package', 'Application Package', 'Analytic Package'], correctIndex: 1 },
      { question: 'What is an IPA?', options: ['A beer', 'iOS App Package', 'Integration Package', 'Application Package'], correctIndex: 1 },
      { question: 'What is TestFlight?', options: ['Testing flight', 'iOS beta testing platform', 'Testing tool', 'Android tool'], correctIndex: 1 },
      { question: 'What should be in app store listing?', options: ['Only name', 'Screenshots, description, keywords, ratings', 'Just price', 'Version number'], correctIndex: 1 },
    ],
  },
];

// Cloud Architect Curriculum
const cloudArchitectWeeks: WeekTemplate[] = [
  {
    title: 'Week 1: Cloud Computing Fundamentals',
    description: 'Understand cloud architecture and services',
    concepts: [
      { title: 'Cloud Concepts & Models', description: 'Understand IaaS, PaaS, SaaS and cloud deployment models.', videoId: 'S8C7RhJC1rg', videoRequiredSeconds: 120, practiceTask: 'Compare IaaS (AWS EC2), PaaS (Heroku), SaaS (Salesforce). Understand public, private, hybrid clouds.' },
      { title: 'AWS Core Services', description: 'Learn AWS EC2, S3, RDS, and networking.', videoId: 'JIbIYCM48to', videoRequiredSeconds: 120, practiceTask: 'Create EC2 instances, use S3 buckets, set up RDS databases, configure VPC networking.' },
      { title: 'Azure & GCP Fundamentals', description: 'Understand Azure and Google Cloud Platform services.', videoId: 'KXkBZCe699A', videoRequiredSeconds: 120, practiceTask: 'Deploy resources on Azure (VMs, App Service), use Google Cloud (Compute Engine, Cloud Storage).' },
    ],
    testQuestions: [
      { question: 'What is IaaS?', options: ['Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Indexing as a Service'], correctIndex: 0 },
      { question: 'What is PaaS?', options: ['Platform as a Service', 'Process as a Service', 'Payment as a Service', 'Package as a Service'], correctIndex: 0 },
      { question: 'What is SaaS?', options: ['Software as a Service', 'System as a Service', 'Security as a Service', 'Storage as a Service'], correctIndex: 0 },
      { question: 'What is AWS EC2?', options: ['A database', 'Virtual computer in cloud', 'Storage service', 'Networking tool'], correctIndex: 1 },
      { question: 'What is S3?', options: ['Simple Storage Service', 'Secure Storage System', 'Session Storage Service', 'Streaming Service'], correctIndex: 0 },
    ],
  },
  {
    title: 'Week 2: Compute, Storage & Networking',
    description: 'Design scalable cloud infrastructure',
    concepts: [
      { title: 'Compute Services & Scaling', description: 'Understand auto-scaling, load balancing, serverless computing.', videoId: 'eOBq__h4OJ4', videoRequiredSeconds: 120, practiceTask: 'Set up auto-scaling groups, load balancers, Lambda functions, App Engine for serverless applications.' },
      { title: 'Storage Solutions', description: 'Choose between object, block, and file storage.', videoId: '77lMCiiMilo', videoRequiredSeconds: 120, practiceTask: 'Use S3, EBS, EFS in AWS; Blob Storage, Managed Disks in Azure; Cloud Storage in GCP.' },
      { title: 'Networking & Security Groups', description: 'Design networks with VPC, subnets, and security groups.', videoId: 'hiKPPy584Mg', videoRequiredSeconds: 120, practiceTask: 'Create VPCs with public/private subnets, configure security groups, implement firewalls.' },
    ],
    testQuestions: [
      { question: 'What is auto-scaling?', options: ['Manual scaling', 'Automatically adjusting capacity', 'Schedule-based scaling', 'Load-based scaling'], correctIndex: 1 },
      { question: 'What is a load balancer?', options: ['Balancing weights', 'Distributing traffic across servers', 'A machine', 'A database'], correctIndex: 1 },
      { question: 'What is Lambda?', options: ['A variable', 'Serverless computing service', 'Function', 'API Gateway'], correctIndex: 1 },
      { question: 'What is a VPC?', options: ['Video Player', 'Virtual Private Cloud', 'Virtual PC', 'Validation Protocol'], correctIndex: 1 },
      { question: 'What is a security group?', options: ['A team', 'Virtual firewall controlling access', 'A network', 'A subnet'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 3: Databases & Data Management',
    description: 'Design and manage cloud databases',
    concepts: [
      { title: 'Relational Databases in Cloud', description: 'Use managed relational databases (RDS, Cloud SQL, Azure Database).', videoId: 'OqNUYYJgkPU', videoRequiredSeconds: 120, practiceTask: 'Set up RDS PostgreSQL/MySQL, Cloud SQL, Azure Database for PostgreSQL/MySQL with backups.' },
      { title: 'NoSQL Databases', description: 'Work with DynamoDB, MongoDB Atlas, Firestore.', videoId: 'sKKoR7xsmqc', videoRequiredSeconds: 120, practiceTask: 'Design DynamoDB tables, use Firestore for document storage, implement data modeling.' },
      { title: 'Data Warehousing & Analytics', description: 'Set up data warehouses for analytics.', videoId: 'WwsfuYYUq5I', videoRequiredSeconds: 120, practiceTask: 'Use Redshift (AWS), BigQuery (GCP), Azure Synapse for data warehousing and analytics.' },
    ],
    testQuestions: [
      { question: 'What is RDS?', options: ['Relational Database Service', 'Real Database System', 'Remote Database Service', 'Read Database System'], correctIndex: 0 },
      { question: 'What is DynamoDB?', options: ['Dynamic database', 'NoSQL database by AWS', 'Data mapper', 'Database version'], correctIndex: 1 },
      { question: 'What is Firestore?', options: ['A fireplace', 'NoSQL document database', 'A storage service', 'A query service'], correctIndex: 1 },
      { question: 'What is BigQuery?', options: ['Large query', 'Data warehouse by Google', 'Database query', 'Query tool'], correctIndex: 1 },
      { question: 'What is database replication?', options: ['Duplicate database', 'Creating database copies for redundancy', 'Backup', 'Migration'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 4: Security, Compliance & Governance',
    description: 'Secure cloud infrastructure',
    concepts: [
      { title: 'Cloud Security Best Practices', description: 'Implement security groups, IAM, encryption, and secure backups.', videoId: 'Fmr-VVJJGKA', videoRequiredSeconds: 120, practiceTask: 'Configure IAM roles and policies, enable MFA, encrypt data at rest and in transit.' },
      { title: 'Compliance & Data Protection', description: 'Ensure compliance with GDPR, HIPAA, and PCI-DSS.', videoId: 'dz-A6YHqKQQ', videoRequiredSeconds: 120, practiceTask: 'Implement data residency, retention policies, audit logging, privacy controls.' },
      { title: 'Disaster Recovery & Business Continuity', description: 'Design disaster recovery and ensure high availability.', videoId: 'gzHHfL78vXA', videoRequiredSeconds: 120, practiceTask: 'Create multi-region setups, implement backup strategies, test failover procedures.' },
    ],
    testQuestions: [
      { question: 'What is IAM?', options: ['International Airlines Management', 'Identity and Access Management', 'Information Access Management', 'Infrastructure Access Management'], correctIndex: 1 },
      { question: 'What is MFA?', options: ['Multi-way Framework', 'Multi-Factor Authentication', 'Multiple File Access', 'Monitoring Framework'], correctIndex: 1 },
      { question: 'What is encryption?', options: ['Making encrypted', 'Converting data to unreadable form', 'Securing passwords', 'Hashing data'], correctIndex: 1 },
      { question: 'What is GDPR?', options: ['General Data Protection Regulation', 'Global Data Privacy Requirement', 'General Database Protocol', 'Group Data Policy'], correctIndex: 0 },
      { question: 'What is RPO?', options: ['Recovery Point Objective', 'Rapid Performance Optimization', 'Remote Protocol Online', 'Resource Protocol Order'], correctIndex: 0 },
    ],
  },
  {
    title: 'Week 5: Cost Optimization & Monitoring',
    description: 'Optimize cloud costs and monitor infrastructure',
    concepts: [
      { title: 'Cost Analysis & Optimization', description: 'Monitor and reduce cloud expenses.', videoId: 'zRMSsKB9gPc', videoRequiredSeconds: 120, practiceTask: 'Use AWS Cost Explorer, Azure Cost Management, GCP Billing. Implement reserved instances and spot instances.' },
      { title: 'Cloud Monitoring & Logging', description: 'Monitor infrastructure and applications.', videoId: 'W7l7EhwQzU0', videoRequiredSeconds: 120, practiceTask: 'Set up CloudWatch, Azure Monitor, Cloud Monitoring. Configure alerts and dashboards.' },
      { title: 'Performance Tuning', description: 'Optimize application and infrastructure performance.', videoId: 'FpjDfMBh3lw', videoRequiredSeconds: 120, practiceTask: 'Analyze performance metrics, identify bottlenecks, implement optimizations.' },
    ],
    testQuestions: [
      { question: 'What is Cost Explorer?', options: ['A tool', 'AWS service for analyzing costs', 'A calculator', 'A billing service'], correctIndex: 1 },
      { question: 'What are reserved instances?', options: ['Reserved servers', 'Pre-purchased compute capacity', 'Scheduled instances', 'Temporary instances'], correctIndex: 1 },
      { question: 'What are spot instances?', options: ['Geographic locations', 'Low-cost spare compute capacity', 'Temporary servers', 'Test instances'], correctIndex: 1 },
      { question: 'What is CloudWatch?', options: ['Cloud surveillance', 'AWS monitoring service', 'Alert system', 'Logging service'], correctIndex: 1 },
      { question: 'What should you monitor?', options: ['Only errors', 'CPU, memory, disk, network, errors', 'Only performance', 'Only logs'], correctIndex: 1 },
    ],
  },
  {
    title: 'Week 6: Enterprise Architecture & Capstone',
    description: 'Design enterprise-grade cloud solutions',
    concepts: [
      { title: 'Enterprise Architecture Patterns', description: 'Design scalable, resilient architectures for enterprises.', videoId: 'B3-R3rWt98Q', videoRequiredSeconds: 120, practiceTask: 'Design multi-tier architecture, implement API gateway, design microservices on cloud.' },
      { title: 'Migration Strategies', description: 'Plan and execute cloud migrations.', videoId: 'XjMR4EbfWpA', videoRequiredSeconds: 120, practiceTask: 'Create migration plan (6Rs framework), use AWS DMS or Azure Data Factory for migrations.' },
      { title: 'Capstone Architecture Project', description: 'Design complete cloud solution for enterprise.', videoId: 'W9y0nCX0j3Q', videoRequiredSeconds: 120, practiceTask: 'Design multi-region, highly available, secure, cost-optimized cloud architecture for business requirements.' },
    ],
    testQuestions: [
      { question: 'What is the 6Rs framework?', options: ['Six strategies', 'Rehost, Replatform, Refactor, Repurchase, Retire, Retain', 'Reporting Rules', 'Resource Recommendations'], correctIndex: 1 },
      { question: 'What is lift and shift?', options: ['Physical movement', 'Migrate as-is to cloud', 'Cloud migration', 'Infrastructure upgrade'], correctIndex: 1 },
      { question: 'What is a multi-region deployment?', options: ['Multiple countries', 'Deployment across multiple cloud regions', 'Multi-cloud', 'Regional backup'], correctIndex: 1 },
      { question: 'What is high availability?', options: ['Expensive', 'System resilience and uptime', 'Performance', 'Scalability'], correctIndex: 1 },
      { question: 'What is scalability?', options: ['Increasing size', 'Ability to handle growth', 'Performance', 'Flexibility'], correctIndex: 1 },
    ],
  },
];

// Map for all roles
const roleContentMap: Record<string, WeekTemplate[]> = {
  frontend: frontendWeeks,
  backend: backendWeeks,
  fullstack: fullstackWeeks,
  'data-science': dataScientistWeeks,
  'ml-engineer': mlEngineerWeeks,
  'devops': devopsWeeks,
  'mobile': mobileWeeks,
  'cloud': cloudArchitectWeeks,
};

const weeklyPlaceholderVideoIds = [
  'UB1O30fR-EE',
  'W6NZfCJ1LWs',
  'Tn6-PIqc4UM',
  'QQYeipc_cik',
  'BwuLxPH8IDs',
  'CvAcHkMC0rQ',
];

const applyWeeklyVideoPlaceholders = (weeks: WeekTemplate[]) =>
  weeks.map((week, index) => {
    const placeholderId = weeklyPlaceholderVideoIds[index];
    if (!placeholderId) {
      return week;
    }

    return {
      ...week,
      concepts: week.concepts.map(concept => ({
        ...concept,
        videoId: placeholderId,
      })),
    };
  });

export function getCourseContent(role: string): WeekTemplate[] {
  // Return role-specific content with proper videos for each role
  const roleWeeks = roleContentMap[role] || frontendWeeks;
  return roleWeeks; // Removed placeholder override - now returns actual role-specific videos
}

export type { WeekTemplate, ConceptTemplate, TestQuestion };
