// Mock data for development and preview purposes
// This simulates the data that would come from the backend API

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorid: string;
  authorname: string;
  createdat: string | null;
  updatedat: string | null;
  rating?: number;
  views?: number;
  thumbnail?: string;
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
    authorid: "user1",
    authorname: "Jane Doe",
    createdat: "2023-04-15T10:30:00Z",
    updatedat: "2023-04-15T10:30:00Z",
    rating: 4.5,
    views: 450,
    thumbnail: "https://example.com/thumbnail1.jpg"
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    content: "TypeScript adds optional static typing to JavaScript. It's designed for the development of large applications and transpiles to JavaScript. In this post, we'll explore advanced TypeScript patterns that can help you write more robust code...",
    excerpt: "Discover powerful TypeScript patterns to enhance your code quality and developer experience.",
    authorid: "user2",
    authorname: "John Smith",
    createdat: "2023-03-22T14:15:00Z",
    updatedat: "2023-03-22T14:15:00Z",
    rating: 4.8,
    views: 320,
    thumbnail: "https://example.com/thumbnail2.jpg"
  },
  {
    id: "3",
    title: "CSS Grid Layout Techniques",
    content: "CSS Grid Layout is a two-dimensional layout system designed for user interface design. It allows you to layout items in rows and columns, and has many features that make building complex layouts straightforward...",
    excerpt: "Master CSS Grid to create responsive and complex layouts with ease.",
    authorid: "user1",
    authorname: "Jane Doe",
    createdat: "2023-02-10T09:45:00Z",
    updatedat: "2023-02-10T09:45:00Z",
    rating: 4.2,
    views: 275,
    thumbnail: "https://example.com/thumbnail3.jpg"
  },
  {
    id: "4",
    title: "JavaScript Promises and Async/Await",
    content: "Promises and async/await are features of JavaScript that allow you to work with asynchronous operations more easily. They provide a cleaner alternative to callbacks and help manage the complexity of asynchronous code...",
    excerpt: "Simplify your asynchronous JavaScript code with Promises and async/await patterns.",
    authorid: "user3",
    authorname: "Alex Johnson",
    createdat: "2023-01-05T16:20:00Z",
    updatedat: "2023-01-05T16:20:00Z",
    rating: 4.6,
    views: 410,
    thumbnail: "https://example.com/thumbnail4.jpg"
  },
  {
    id: "5",
    title: "Building RESTful APIs with Node.js",
    content: "Node.js is perfect for building RESTful APIs due to its non-blocking I/O model. In this tutorial, we'll cover how to create a RESTful service using Express.js, MongoDB, and best practices for API design...",
    excerpt: "Learn how to design and implement robust RESTful APIs using Node.js and Express.",
    authorid: "user2",
    authorname: "John Smith",
    createdat: "2022-12-18T11:10:00Z",
    updatedat: "2022-12-18T11:10:00Z",
    rating: 4.4,
    views: 380,
    thumbnail: "https://example.com/thumbnail5.jpg"
  },
  {
    id: "6",
    title: "Introduction to TailwindCSS",
    content: "TailwindCSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. It provides low-level utility classes that let you build completely custom designs...",
    excerpt: "Discover how TailwindCSS can speed up your UI development with its utility-first approach.",
    authorid: "user3",
    authorname: "Alex Johnson",
    createdat: "2022-11-30T08:45:00Z",
    updatedat: "2022-11-30T08:45:00Z",
    rating: 4.7,
    views: 290,
    thumbnail: "https://example.com/thumbnail6.jpg"
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
      authorid: "current-user",
      authorname: "Current User",
      createdat: "2023-04-15T10:30:00Z",
      updatedat: "2023-04-15T10:30:00Z",
      rating: 4.5,
      views: 450,
      thumbnail: "https://example.com/thumbnail1.jpg"
    },
    {
      id: "3",
      title: "CSS Grid Layout Techniques",
      content: "Full content here...",
      excerpt: "Master CSS Grid to create responsive and complex layouts with ease.",
      authorid: "current-user",
      authorname: "Current User",
      createdat: "2023-02-10T09:45:00Z",
      updatedat: "2023-02-10T09:45:00Z",
      rating: 4.2,
      views: 275,
      thumbnail: "https://example.com/thumbnail3.jpg"
    },
    {
      id: "6",
      title: "Introduction to TailwindCSS",
      content: "Full content here...",
      excerpt: "Discover how TailwindCSS can speed up your UI development with its utility-first approach.",
      authorid: "current-user",
      authorname: "Current User",
      createdat: "2023-01-05T16:20:00Z",
      updatedat: "2023-01-05T16:20:00Z",
      rating: 4.7,
      views: 320,
      thumbnail: "https://example.com/thumbnail6.jpg"
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
          authorid: "current-user",
          authorname: "Current User",
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
          rating: 0,
          views: 0,
          thumbnail: "https://example.com/thumbnail.jpg"
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
