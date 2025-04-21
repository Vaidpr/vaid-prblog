
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchDashboardData } from "@/lib/api";
import { LayoutDashboard, Eye, Star, FileText, PenSquare } from "lucide-react";
import { DashboardData } from "@/lib/mockData";

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText size={18} className="text-blue-500" />
              <span>Total Posts</span>
            </CardDescription>
            <CardTitle className="text-4xl">{data?.totalPosts || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Eye size={18} className="text-green-500" />
              <span>Total Views</span>
            </CardDescription>
            <CardTitle className="text-4xl">{data?.totalViews || 0}</CardTitle>
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

      {/* User's Posts */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Your Posts</CardTitle>
          <CardDescription>Manage and track the performance of your content</CardDescription>
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
                    <th className="text-center py-3 px-4 font-semibold">Views</th>
                    <th className="text-center py-3 px-4 font-semibold">Rating</th>
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
                      <td className="py-3 px-4 text-center">{post.views}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Star size={16} className="text-yellow-500 mr-1" />
                          <span>{post.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link to={`/posts/${post.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
