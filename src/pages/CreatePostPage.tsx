
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createPost } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    content?: string;
  }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const errors: {
      title?: string;
      content?: string;
    } = {};
    
    // Title validation
    if (!title.trim()) {
      errors.title = "Title is required";
    } else if (title.length < 5) {
      errors.title = "Title must be at least 5 characters";
    }
    
    // Content validation
    if (!content.trim()) {
      errors.content = "Content is required";
    } else if (content.length < 20) {
      errors.content = "Content must be at least 20 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await createPost({ title, content });
      toast({
        title: "Success",
        description: "Your post has been created successfully",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Failed to create post",
        description: error.message || "An error occurred while creating your post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
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
      
      <Card className="shadow-xl border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
          <CardDescription>
            Share your thoughts, stories, or expertise with the Vaidpr community
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title"
                className={`text-lg ${validationErrors.title ? "border-red-500" : ""}`}
              />
              {validationErrors.title && (
                <p className="text-xs text-red-500">{validationErrors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                className={`min-h-[300px] resize-y ${validationErrors.content ? "border-red-500" : ""}`}
              />
              {validationErrors.content && (
                <p className="text-xs text-red-500">{validationErrors.content}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tip: Write a detailed and engaging post to attract more readers.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t pt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  <span>Publishing...</span>
                </div>
              ) : (
                "Publish Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreatePostPage;
