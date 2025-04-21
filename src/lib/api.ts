import { auth } from "./firebase";
import { supabase } from "./supabase";

const API_URL = "https://api.example.com"; // Replace with your actual Flask API URL

// Helper to get auth token
const getAuthHeader = async () => {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all blog posts
export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) {
    console.error("Error fetching posts from Supabase:", error);
    throw error;
  }
  return data || [];
};

// Fetch a single post by ID
export const fetchPostById = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error(`Error fetching post ${id} from Supabase:`, error);
    throw error;
  }
  return data;
};

// Create a new post
export const createPost = async (postData: { title: string; content: string }) => {
  // Attach author info from Firebase current user
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to create a post.");

  const { data, error } = await supabase.from("posts").insert([
    {
      title: postData.title,
      content: postData.content,
      authorId: user.uid,
      authorName: user.displayName || user.email || "Anonymous",
      // Add other fields as necessary (views, rating, etc.)
    },
  ]).select().single();

  if (error) {
    console.error("Error creating post in Supabase:", error);
    throw error;
  }
  return data;
};

// Fetch user dashboard data
export const fetchDashboardData = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to view dashboard data.");

  // Fetch user's posts
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("authorId", user.uid)
    .order("createdAt", { ascending: false });
  if (error) {
    console.error("Error fetching dashboard data from Supabase:", error);
    throw error;
  }

  // Calculate stats
  const totalPosts = posts?.length || 0;
  const totalViews = posts?.reduce((sum, p) => sum + (p.views ?? 0), 0) || 0;
  const avgRating = posts && posts.length
    ? posts.reduce((sum, p) => sum + (p.rating ?? 0), 0) / posts.length
    : 0;

  return {
    totalPosts,
    totalViews,
    averageRating: avgRating,
    posts: posts || [],
  };
};
