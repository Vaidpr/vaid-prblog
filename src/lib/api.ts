
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Post, DashboardData } from "@/lib/mockData";
import { Constants } from "@/integrations/supabase/types";

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
    thumbnail: data.thumbnail ?? "",
    category: data.category || "All",
    visibility: data.visibility || "public",
  };
}

// Create or update user profile after signup/login
export const updateUserProfile = async (username: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("You must be logged in to update your profile.");
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      { 
        id: session.user.id, 
        username,
        email: session.user.email 
      },
      { onConflict: 'id' }
    )
    .select()
    .single();
    
  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
  
  return data;
};

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
export const createPost = async (postData: { 
  title: string; 
  content: string; 
  thumbnail?: string;
  category: string;
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("You must be logged in to create a post.");
  const user = session.user;
  
  // Ensure the category is a valid enum value
  const validCategories = Constants.public.Enums.post_category;
  const category = validCategories.includes(postData.category as any) 
    ? postData.category 
    : "All";
  
  const { data, error } = await supabase.from("posts").insert({
    title: postData.title,
    content: postData.content,
    thumbnail: postData.thumbnail || null,
    category: category as any,
    authorid: user.id,
    authorname: user.email || "Anonymous",
  }).select().maybeSingle();

  if (error) {
    console.error("Error creating post in Supabase:", error);
    throw error;
  }
  return mapPost(data);
};

// Rate a post
export const ratePost = async (postId: string, rating: number): Promise<Post> => {
  // Ensure rating is between 1 and 5
  const validRating = Math.min(Math.max(rating, 1), 5);
  
  // First get the current rating
  const { data: currentPost, error: fetchError } = await supabase
    .from("posts")
    .select("rating")
    .eq("id", postId)
    .maybeSingle();
    
  if (fetchError) {
    console.error(`Error fetching post ${postId} from Supabase:`, fetchError);
    throw fetchError;
  }
  
  // Calculate new rating (for now a simple average of the current and new rating)
  // In a real app, you'd store individual ratings and calculate the average
  const currentRating = currentPost?.rating || 0;
  const newRating = currentRating > 0 ? (currentRating + validRating) / 2 : validRating;
  
  // Update the post with the new rating
  const { data, error } = await supabase
    .from("posts")
    .update({ rating: newRating })
    .eq("id", postId)
    .select()
    .maybeSingle();
  
  if (error) {
    console.error(`Error rating post ${postId} in Supabase:`, error);
    throw error;
  }
  
  return mapPost(data);
};

// Save a post to user's bookmarks
export const savePost = async (postId: string): Promise<void> => {
  // For now, we'll use localStorage to save bookmarks
  // In a real app, you would store this in Supabase
  const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
  if (!savedPosts.includes(postId)) {
    savedPosts.push(postId);
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }
};

// Remove a post from user's bookmarks
export const unsavePost = async (postId: string): Promise<void> => {
  const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
  const updatedPosts = savedPosts.filter((id: string) => id !== postId);
  localStorage.setItem("savedPosts", JSON.stringify(updatedPosts));
};

// Check if a post is saved
export const isPostSaved = (postId: string): boolean => {
  const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
  return savedPosts.includes(postId);
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
  const avgRating = postList.length
    ? postList.reduce((sum, p) => sum + (p.rating ?? 0), 0) / postList.length
    : 0;

  return {
    totalPosts,
    totalViews: 0, // Keep this value but don't use it
    averageRating: avgRating,
    posts: postList,
  };
};

export const updatePostVisibility = async (postId: string, visibility: 'public' | 'private'): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .update({ visibility })
    .eq("id", postId)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating post ${postId} visibility:`, error);
    throw error;
  }
  
  return mapPost(data);
};

export const deletePost = async (postId: string): Promise<void> => {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);
    
  if (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
};

// New function to get blog recommendations
export const getRecommendations = async (): Promise<Post[]> => {
  // Get user's search history from localStorage
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
  
  // Get user session to check if logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  let recommendedPosts: Post[] = [];
  
  try {
    // If user has search history, use it for recommendations
    if (searchHistory.length > 0) {
      // Get the most recent 3 search terms
      const recentSearches = searchHistory.slice(-3);
      
      // For each search term, find matching posts
      for (const searchTerm of recentSearches) {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
          .eq("visibility", "public")
          .limit(3);
          
        if (!error && data) {
          recommendedPosts = [...recommendedPosts, ...data.map(mapPost)];
        }
      }
    }
    
    // If we don't have enough recommendations yet or no search history,
    // add some based on top-rated posts
    if (recommendedPosts.length < 3) {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("visibility", "public")
        .order("rating", { ascending: false })
        .limit(5);
        
      if (!error && data) {
        // Add these posts to our recommendations, avoiding duplicates
        const existingIds = recommendedPosts.map(p => p.id);
        const newPosts = data
          .filter(post => !existingIds.includes(post.id))
          .map(mapPost);
          
        recommendedPosts = [...recommendedPosts, ...newPosts];
      }
    }
    
    // If user is logged in, try to get posts from their followed categories
    if (session?.user) {
      // Get user's preferred categories (for now we'll use localStorage, in a real app this would be stored in the database)
      const preferredCategories = JSON.parse(localStorage.getItem("preferredCategories") || "[]");
      
      if (preferredCategories.length > 0) {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .in("category", preferredCategories)
          .eq("visibility", "public")
          .limit(3);
          
        if (!error && data) {
          // Add these posts to our recommendations, avoiding duplicates
          const existingIds = recommendedPosts.map(p => p.id);
          const newPosts = data
            .filter(post => !existingIds.includes(post.id))
            .map(mapPost);
            
          recommendedPosts = [...recommendedPosts, ...newPosts];
        }
      }
    }
    
    // Remove duplicates if any and limit to 6 recommendations
    const uniquePosts = recommendedPosts.filter((post, index, self) =>
      index === self.findIndex((p) => p.id === post.id)
    );
    
    return uniquePosts.slice(0, 6);
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
};
