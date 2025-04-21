
// Mock data for development and preview purposes
// This simulates the data that would come from the backend API

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  rating: number;
  views: number;
  createdAt: string;
}

export interface DashboardData {
  totalPosts: number;
  totalViews: number;
  averageRating: number;
  posts: Post[];
}

// Sample posts for the home page
export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "Getting Started with React",
    content: "React is a popular JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer in web and mobile apps. React allows us to create reusable UI components...",
    excerpt: "Learn the fundamentals of React and how to build your first component-based application.",
    authorId: "user1",
    authorName: "Jane Doe",
    rating: 4.5,
    views: 450,
    createdAt: "2023-04-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    content: "TypeScript adds optional static typing to JavaScript. It's designed for the development of large applications and transpiles to JavaScript. In this post, we'll explore advanced TypeScript patterns that can help you write more robust code...",
    excerpt: "Discover powerful TypeScript patterns to enhance your code quality and developer experience.",
    authorId: "user2",
    authorName: "John Smith",
    rating: 4.8,
    views: 320,
    createdAt: "2023-03-22T14:15:00Z"
  },
  {
    id: "3",
    title: "CSS Grid Layout Techniques",
    content: "CSS Grid Layout is a two-dimensional layout system designed for user interface design. It allows you to layout items in rows and columns, and has many features that make building complex layouts straightforward...",
    excerpt: "Master CSS Grid to create responsive and complex layouts with ease.",
    authorId: "user1",
    authorName: "Jane Doe",
    rating: 4.2,
    views: 275,
    createdAt: "2023-02-10T09:45:00Z"
  },
  {
    id: "4",
    title: "JavaScript Promises and Async/Await",
    content: "Promises and async/await are features of JavaScript that allow you to work with asynchronous operations more easily. They provide a cleaner alternative to callbacks and help manage the complexity of asynchronous code...",
    excerpt: "Simplify your asynchronous JavaScript code with Promises and async/await patterns.",
    authorId: "user3",
    authorName: "Alex Johnson",
    rating: 4.6,
    views: 410,
    createdAt: "2023-01-05T16:20:00Z"
  },
  {
    id: "5",
    title: "Building RESTful APIs with Node.js",
    content: "Node.js is perfect for building RESTful APIs due to its non-blocking I/O model. In this tutorial, we'll cover how to create a RESTful service using Express.js, MongoDB, and best practices for API design...",
    excerpt: "Learn how to design and implement robust RESTful APIs using Node.js and Express.",
    authorId: "user2",
    authorName: "John Smith",
    rating: 4.4,
    views: 380,
    createdAt: "2022-12-18T11:10:00Z"
  },
  {
    id: "6",
    title: "Introduction to TailwindCSS",
    content: "TailwindCSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. It provides low-level utility classes that let you build completely custom designs...",
    excerpt: "Discover how TailwindCSS can speed up your UI development with its utility-first approach.",
    authorId: "user3",
    authorName: "Alex Johnson",
    rating: 4.7,
    views: 290,
    createdAt: "2022-11-30T08:45:00Z"
  }
];

// User's dashboard data
export const MOCK_DASHBOARD_DATA: DashboardData = {
  totalPosts: 3,
  totalViews: 1045,
  averageRating: 4.5,
  posts: [
    {
      id: "1",
      title: "Getting Started with React",
      content: "Full content here...",
      excerpt: "Learn the fundamentals of React and how to build your first component-based application.",
      authorId: "current-user",
      authorName: "Current User",
      rating: 4.5,
      views: 450,
      createdAt: "2023-04-15T10:30:00Z"
    },
    {
      id: "3",
      title: "CSS Grid Layout Techniques",
      content: "Full content here...",
      excerpt: "Master CSS Grid to create responsive and complex layouts with ease.",
      authorId: "current-user",
      authorName: "Current User",
      rating: 4.2,
      views: 275,
      createdAt: "2023-02-10T09:45:00Z"
    },
    {
      id: "6",
      title: "Introduction to TailwindCSS",
      content: "Full content here...",
      excerpt: "Discover how TailwindCSS can speed up your UI development with its utility-first approach.",
      authorId: "current-user",
      authorName: "Current User",
      rating: 4.7,
      views: 320,
      createdAt: "2023-01-05T16:20:00Z"
    }
  ]
};

// Simulated API delay
const SIMULATED_DELAY = 800;

// Mock API functions that simulate actual API calls
export const mockApi = {
  // Fetch all blog posts
  fetchPosts: () => {
    return new Promise<Post[]>((resolve) => {
      setTimeout(() => {
        resolve(MOCK_POSTS);
      }, SIMULATED_DELAY);
    });
  },

  // Fetch a single post by ID
  fetchPostById: (id: string) => {
    return new Promise<Post | undefined>((resolve, reject) => {
      setTimeout(() => {
        const post = MOCK_POSTS.find(post => post.id === id);
        if (post) {
          resolve(post);
        } else {
          reject(new Error('Post not found'));
        }
      }, SIMULATED_DELAY);
    });
  },

  // Create a new post
  createPost: (postData: { title: string; content: string }) => {
    return new Promise<Post>((resolve) => {
      setTimeout(() => {
        const newPost: Post = {
          id: `${Date.now()}`,
          title: postData.title,
          content: postData.content,
          excerpt: postData.content.substring(0, 150) + "...",
          authorId: "current-user",
          authorName: "Current User",
          rating: 0,
          views: 0,
          createdAt: new Date().toISOString()
        };

        // In a real app, this would be added to the database
        resolve(newPost);
      }, SIMULATED_DELAY);
    });
  },

  // Fetch user dashboard data
  fetchDashboardData: () => {
    return new Promise<DashboardData>((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DASHBOARD_DATA);
      }, SIMULATED_DELAY);
    });
  }
};
