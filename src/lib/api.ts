
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Post, DashboardData } from "@/lib/mockData";

// Helper to map Supabase post to app Post type
function mapPost(data: any): Post {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt ?? "",
    authorid: data.authorid,
    authorname: data.authorname,
    createdat: data.createdat,
    updatedat: data.updatedat,
    rating: data.rating ?? 0,
    views: data.views ?? 0,
    thumbnail: data.thumbnail ?? "",
  };
}

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
  return (data || []).map(mapPost);
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
  return data ? mapPost(data) : null;
};

// Create a new post
export const createPost = async (postData: { title: string; content: string; thumbnail?: string }) => {
  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("You must be logged in to create a post.");
  const user = session.user;
  const { data, error } = await supabase.from("posts").insert([
    {
      title: postData.title,
      content: postData.content,
      thumbnail: postData.thumbnail || null,
      authorid: user.id,
      authorname: user.email || "Anonymous",
    },
  ]).select().maybeSingle();

  if (error) {
    console.error("Error creating post in Supabase:", error);
    throw error;
  }
  return mapPost(data);
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

  const postList = (posts || []).map(mapPost);
  // Calculate stats
  const totalPosts = postList.length;
  const totalViews = postList.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const avgRating = postList.length
    ? postList.reduce((sum, p) => sum + (p.rating ?? 0), 0) / postList.length
    : 0;

  return {
    totalPosts,
    totalViews,
    averageRating: avgRating,
    posts: postList,
  };
};
