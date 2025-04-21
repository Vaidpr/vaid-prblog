
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchPostById } from "@/lib/api";
import { ArrowLeft, Eye, Star, Calendar } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Tables<'posts'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchPostById(id);
        setPost(data);

        // Check if current user is the author (this logic needs Supabase auth; skipping for now)
        // const currentUser = ???;
        // if (currentUser && data && data.authorid === currentUser.id) {
        //   setIsAuthor(true);
        // }
      } catch (err) {
        setError("Failed to load this post. It may have been removed or is unavailable.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto shadow-lg border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-6">{error || "Post not found"}</p>
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = post.createdat
    ? new Date(post.createdat).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto shadow-xl border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm mt-3 gap-y-2">
            <div className="flex items-center mr-4">
              <span className="font-medium mr-1">By:</span>
              <span>{post.authorname}</span>
            </div>
            <div className="flex items-center mr-4">
              <Calendar size={14} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center mr-4">
              <Eye size={14} className="mr-1" />
              <span>{post.views ?? 0} views</span>
            </div>
            <div className="flex items-center">
              <Star size={14} className="mr-1 text-yellow-500" />
              <span>{(post.rating ?? 0).toFixed(1)} rating</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-6 border-t border-gray-100 dark:border-gray-800">
          <div className="prose max-w-none dark:prose-invert">
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.content}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye size={14} />
              <span>{post.views ?? 0} views</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              <span>{(post.rating ?? 0).toFixed(1)} rating</span>
            </Badge>
          </div>
          
          {isAuthor && (
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Edit Post
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostDetailPage;
