
export interface DashboardData {
  totalPosts: number;
  totalViews: number;
  averageRating: number;
  posts: Post[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorid: string;
  authorname: string;
  createdat?: string;
  updatedat?: string;
  rating?: number;
  views?: number;
  thumbnail?: string;
  category: string;
  visibility?: string; // Add visibility property
}
