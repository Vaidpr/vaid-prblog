
import { useState, useEffect } from "react";
import { fetchPosts } from "@/lib/api";
import { Post } from "@/lib/mockData";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookmarkCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SavedBlogsPage = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const { toast } = useToast();

  useEffect(() => {
    const loadSavedPosts = async () => {
      try {
        setLoading(true);
        
        // For now, we'll simulate saved posts from localStorage
        // In a real app, you would fetch this from Supabase
        const savedPostIds = JSON.parse(localStorage.getItem("savedPosts") || "[]");
        
        if (savedPostIds.length === 0) {
          setSavedPosts([]);
          setFilteredPosts([]);
          setLoading(false);
          return;
        }
        
        // Fetch all posts and filter them to the saved ones
        const allPosts = await fetchPosts();
        const saved = allPosts.filter(post => savedPostIds.includes(post.id));
        
        setSavedPosts(saved);
        setFilteredPosts(saved);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load saved posts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSavedPosts();
  }, [toast]);

  useEffect(() => {
    // Filter posts based on search query
    const filtered = savedPosts.filter(post => 
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
  }, [searchQuery, sortOption, savedPosts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Saved Blogs</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search saved blogs..."
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
      ) : filteredPosts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <BookmarkCheck size={48} className="text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">You haven't saved any blogs yet.</p>
          </div>
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

export default SavedBlogsPage;
