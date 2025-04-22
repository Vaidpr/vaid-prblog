
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/api";

// Helper function to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  // Get the project URL from the environment or window
  const supabaseUrl = (window as any).SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = (window as any).SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  // Check if the URL and key are valid (not empty and not placeholders)
  return (
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder-project') &&
    !supabaseAnonKey.includes('placeholder-key')
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if Supabase is configured correctly
    if (!isSupabaseConfigured()) {
      setConfigError("Supabase is not properly configured. Please connect your project to Supabase.");
    } else {
      setConfigError(null);
    }

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if Supabase is properly configured first
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not properly configured. Please connect your project to Supabase using the green Supabase button in the top right corner.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) return;
    
    setUsernameChecking(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (error) throw error;
      
      setUsernameAvailable(data === null);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    const timeoutId = setTimeout(() => {
      if (value.length >= 3) {
        checkUsernameAvailability(value);
      } else {
        setUsernameAvailable(null);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usernameAvailable) {
      toast({
        title: "Registration failed",
        description: "Username is already taken or invalid",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Check if Supabase is properly configured first
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not properly configured. Please connect your project to Supabase using the green Supabase button in the top right corner.");
      }
      
      // Get the current URL for redirection
      const redirectUrl = window.location.origin;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) throw authError;
      
      toast({
        title: "Registration successful",
        description: "Your account has been created! Please check your email to confirm your registration.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      {configError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Configuration Error</p>
          <p>{configError}</p>
          <p className="text-sm mt-2">Please connect your project to Supabase using the green Supabase button in the top right corner of the interface.</p>
        </div>
      )}
      
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a 
                      href="#" 
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="username"
                    required
                    minLength={3}
                    value={username}
                    onChange={handleUsernameChange}
                    className={
                      usernameAvailable === true
                        ? "border-green-500"
                        : usernameAvailable === false
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {usernameChecking && (
                    <p className="text-xs text-gray-500">Checking availability...</p>
                  )}
                  {!usernameChecking && usernameAvailable === true && (
                    <p className="text-xs text-green-500">Username is available</p>
                  )}
                  {!usernameChecking && usernameAvailable === false && (
                    <p className="text-xs text-red-500">Username is already taken</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input
                    id="password-register"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || usernameAvailable === false}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginPage;
