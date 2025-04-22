
import { useState, useEffect } from "react";
import { fetchPosts } from "@/lib/api";
import { Post } from "@/lib/mockData";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star } from "lucide-react";

const CategoriesPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        setError("Failed to load blog posts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    // Filter posts based on search query
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort the filtered posts
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "highest-rating":
          return (b.rating || 0) - (a.rating || 0);
        case "lowest-rating":
          return (a.rating || 0) - (b.rating || 0);
        case "newest":
          return new Date(b.createdat || "").getTime() - new Date(a.createdat || "").getTime();
        case "oldest":
          return new Date(a.createdat || "").getTime() - new Date(b.createdat || "").getTime();
        default:
          return 0;
      }
    });

    setFilteredPosts(sorted);
  }, [searchQuery, sortOption, posts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Categories</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search blogs by title, content or author..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest-rating">Highest Rating</SelectItem>
              <SelectItem value="lowest-rating">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">No posts found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
