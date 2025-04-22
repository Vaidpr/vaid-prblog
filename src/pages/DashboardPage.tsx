
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchDashboardData, updatePostVisibility, deletePost } from "@/lib/api";
import { PenSquare, Star, Eye, MoreHorizontal, Edit, Trash2, EyeOff } from "lucide-react";
import { DashboardData } from "@/lib/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (error) {
        toast({
          title: "Failed to load dashboard",
          description: "Could not retrieve your dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  const handleVisibilityToggle = async (postId: string, currentVisibility: string) => {
    try {
      const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
      await updatePostVisibility(postId, newVisibility);
      
      // Update local state
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          posts: prev.posts.map(post => 
            post.id === postId 
              ? { ...post, visibility: newVisibility }
              : post
          )
        };
      });

      toast({
        title: "Post visibility updated",
        description: `Post is now ${newVisibility}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post visibility",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletePostId) return;

    try {
      await deletePost(deletePostId);
      
      // Update local state
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          posts: prev.posts.filter(post => post.id !== deletePostId),
          totalPosts: prev.totalPosts - 1
        };
      });

      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setDeletePostId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/create-post">
          <Button className="flex items-center gap-2">
            <PenSquare size={16} />
            <span>New Post</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <PenSquare size={18} className="text-blue-500" />
              <span>Total Posts</span>
            </CardDescription>
            <CardTitle className="text-4xl">{data?.totalPosts || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Star size={18} className="text-yellow-500" />
              <span>Average Rating</span>
            </CardDescription>
            <CardTitle className="text-4xl">{data?.averageRating.toFixed(1) || "0.0"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Your Posts</CardTitle>
          <CardDescription>Manage and track your content</CardDescription>
        </CardHeader>
        <CardContent>
          {!data || data.posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
              <Link to="/create-post">
                <Button>Create Your First Post</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-center py-3 px-4 font-semibold">Rating</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold">Date</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.posts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium truncate max-w-[250px]">{post.title}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Star size={16} className="text-yellow-500 mr-1" />
                          <span>{(post.rating || 0).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.visibility === 'public' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.visibility}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {post.createdat ? new Date(post.createdat).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/posts/${post.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleVisibilityToggle(post.id, post.visibility || 'public')}
                            >
                              <EyeOff className="mr-2 h-4 w-4" />
                              {post.visibility === 'public' ? 'Make Private' : 'Make Public'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setDeletePostId(post.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;
