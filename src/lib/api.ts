
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Post, DashboardData } from "@/lib/mockData";

// Fetch all blog posts
export const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("createdat", { ascending: false });
  if (error) {
    console.error("Error fetching posts from Supabase:", error);
    throw error;
  }
  return data || [];
};

// Fetch a single post by ID
export const fetchPostById = async (id: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error(`Error fetching post ${id} from Supabase:`, error);
    throw error;
  }
  return data as Post | null;
};

// Create a new post
export const createPost = async (postData: { title: string; content: string }) => {
  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("You must be logged in to create a post.");
  
  const user = session.user;

  const { data, error } = await supabase.from("posts").insert([
    {
      title: postData.title,
      content: postData.content,
      authorid: user.id,
      authorname: user.email || "Anonymous",
    },
  ]).select().maybeSingle();

  if (error) {
    console.error("Error creating post in Supabase:", error);
    throw error;
  }
  
  return data as Post;
};

// Fetch user dashboard data
export const fetchDashboardData = async (): Promise<DashboardData> => {
  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("You must be logged in to view dashboard data.");
  
  const user = session.user;

  // Fetch user's posts
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("authorid", user.id)
    .order("createdat", { ascending: false });
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
