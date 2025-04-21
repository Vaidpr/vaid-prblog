
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/mockData";
import { Eye, Star } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";

interface BlogCardProps {
  post: Post;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80"; // Picked from allowed placeholder_images

const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = post.createdat 
    ? new Date(post.createdat).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // Use the actual thumbnail if provided, otherwise fallback to placeholder
  const thumbnailSrc = post.thumbnail && post.thumbnail.length > 5 ? post.thumbnail : PLACEHOLDER_IMAGE;

  return (
    <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-gray-200 dark:border-gray-700">
      <div className="w-full">
        <ResponsiveImage
          src={thumbnailSrc}
          alt={post.title + " thumbnail"}
          aspectRatio="video"
          className="w-full h-40"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">By {post.authorname}</span>
        </div>
        <CardTitle className="text-xl font-bold truncate">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
          {post.excerpt || post.content?.substring(0, 150) + "..." || "No excerpt available for this post."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <Star size={12} />
            <span>{(post.rating || 0).toFixed(1)}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Eye size={12} />
            <span>{post.views || 0}</span>
          </Badge>
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
