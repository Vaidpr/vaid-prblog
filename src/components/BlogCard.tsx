
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/mockData";
import { Star, Bookmark, BookmarkCheck } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useToast } from "@/hooks/use-toast";
import { ratePost, savePost, unsavePost, isPostSaved } from "@/lib/api";

interface BlogCardProps {
  post: Post;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80";

const BlogCard = ({ post }: BlogCardProps) => {
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(post.rating || 0);
  const [isRating, setIsRating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSaved(isPostSaved(post.id));
  }, [post.id]);

  const formattedDate = post.createdat 
    ? new Date(post.createdat).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const thumbnailSrc = post.thumbnail && post.thumbnail.length > 5 ? post.thumbnail : PLACEHOLDER_IMAGE;

  const handleToggleSave = async () => {
    try {
      if (saved) {
        await unsavePost(post.id);
        toast({
          title: "Post removed from saved blogs",
          description: "The post has been removed from your saved blogs",
        });
      } else {
        await savePost(post.id);
        toast({
          title: "Post saved",
          description: "The post has been added to your saved blogs",
        });
      }
      setSaved(!saved);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save/unsave post",
        variant: "destructive",
      });
    }
  };

  const handleRate = async (newRating: number) => {
    if (isRating) return;
    
    try {
      setIsRating(true);
      const updatedPost = await ratePost(post.id, newRating);
      setRating(updatedPost.rating || 0);
      toast({
        title: "Rating submitted",
        description: "Thank you for rating this post!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      });
    } finally {
      setIsRating(false);
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-gray-200 dark:border-gray-700">
      <div className="w-full relative">
        <ResponsiveImage
          src={thumbnailSrc}
          alt={post.title + " thumbnail"}
          aspectRatio="video"
          className="w-full h-40"
        />
        <button
          onClick={handleToggleSave}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          aria-label={saved ? "Unsave post" : "Save post"}
        >
          {saved ? (
            <BookmarkCheck size={18} className="text-primary" />
          ) : (
            <Bookmark size={18} className="text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">By {post.authorname}</span>
        </div>
        <CardTitle className="text-xl font-bold truncate">{post.title}</CardTitle>
        <Badge variant="secondary" className="mt-2">
          {post.category}
        </Badge>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
          {post.excerpt || post.content?.substring(0, 150) + "..." || "No excerpt available for this post."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              disabled={isRating}
              className="focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={14}
                className={
                  rating >= star
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300 dark:text-gray-600"
                }
              />
            </button>
          ))}
        </div>
        <Link to={`/posts/${post.id}`}>
          <Button variant="secondary" size="sm" className="font-medium">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
