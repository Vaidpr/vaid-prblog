
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "@/lib/api";
import BlogCard from "@/components/BlogCard";
import { Post } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { auth } from "@/lib/firebase";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError("Failed to load blog posts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-16 py-16 px-4 rounded-2xl overflow-hidden hero-gradient bg-gradient-to-r from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-violet-900 dark:from-purple-400 dark:to-violet-300">
            Welcome to Vaidpr Blog
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the latest insights, stories, and knowledge from our community of writers and thinkers.
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/create-post">
                <Button className="font-medium flex items-center gap-2 shadow-md hover:shadow-lg">
                  <PenSquare size={18} />
                  <span>Create New Post</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="font-medium shadow-md hover:shadow-lg">
                  Join Our Community
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-purple-200/50 dark:bg-purple-900/20"></div>
        <div className="absolute top-10 -left-8 w-24 h-24 rounded-full bg-indigo-200/50 dark:bg-indigo-900/20"></div>
      </div>

      {/* Posts Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Articles</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No posts available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-purple-100 dark:bg-purple-900/20 rounded-xl p-8 text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">Ready to share your story?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Join our community of writers and thinkers. Create an account today and start sharing your knowledge with the world.
        </p>
        {isAuthenticated ? (
          <Link to="/create-post">
            <Button size="lg" className="shadow-md">
              Create Your First Post
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button size="lg" className="shadow-md">
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
