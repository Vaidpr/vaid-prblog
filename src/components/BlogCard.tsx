
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/mockData";
import { Eye, Star } from "lucide-react";

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">By {post.authorName}</span>
        </div>
        <CardTitle className="text-xl font-bold truncate">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
          {post.excerpt || "No excerpt available for this post."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <Star size={12} />
            <span>{post.rating.toFixed(1)}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Eye size={12} />
            <span>{post.views}</span>
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
