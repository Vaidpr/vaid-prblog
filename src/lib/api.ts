
import { auth } from "./firebase";
import { mockApi } from "./mockData";

const API_URL = "https://api.example.com"; // Replace with your actual Flask API URL

// Helper to get auth token
const getAuthHeader = async () => {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all blog posts
export const fetchPosts = async () => {
  // For development, use mock data
  if (process.env.NODE_ENV === "development") {
    return mockApi.fetchPosts();
  }

  try {
    const response = await fetch(`${API_URL}/api/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Fetch a single post by ID
export const fetchPostById = async (id: string) => {
  // For development, use mock data
  if (process.env.NODE_ENV === "development") {
    return mockApi.fetchPostById(id);
  }

  try {
    const response = await fetch(`${API_URL}/api/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

// Create a new post
export const createPost = async (postData: { title: string; content: string }) => {
  // For development, use mock data
  if (process.env.NODE_ENV === "development") {
    return mockApi.createPost(postData);
  }

  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(postData)
    });
    if (!response.ok) throw new Error('Failed to create post');
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Fetch user dashboard data
export const fetchDashboardData = async () => {
  // For development, use mock data
  if (process.env.NODE_ENV === "development") {
    return mockApi.fetchDashboardData();
  }

  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/user/dashboard`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
