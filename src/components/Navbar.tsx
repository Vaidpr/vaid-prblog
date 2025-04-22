import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LogIn, LogOut, User as UserIcon, Settings, BookmarkCheck, Folder, FolderOpen, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setCurrentUser(session?.user || null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = () => {
    setIsOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md" 
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Vaidpr
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center gap-1 transition-colors hover:text-primary ${
                isActive("/") ? "text-primary font-medium" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/categories" 
              className={`flex items-center gap-1 transition-colors hover:text-primary ${
                isActive("/categories") ? "text-primary font-medium" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Folder size={16} />
              <span>Categories</span>
            </Link>
            
            {currentUser && (
              <Link 
                to="/saved-blogs" 
                className={`flex items-center gap-1 transition-colors hover:text-primary ${
                  isActive("/saved-blogs") ? "text-primary font-medium" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <BookmarkCheck size={16} />
                <span>Saved Blogs</span>
              </Link>
            )}

            <button
              onClick={toggleSearch}
              className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button aria-label="Profile" className="focus:outline-none ml-3">
                    <Avatar>
                      <AvatarFallback>
                        <UserIcon size={20} />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <UserIcon size={16}/>
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/create-post" className="flex items-center gap-2">
                      <FolderOpen size={16}/>
                      <span>Create Post</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account-settings" className="flex items-center gap-2">
                      <Settings size={16}/>
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <LogOut size={16}/>
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-1">
                  <LogIn size={16} />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isSearchVisible && (
          <div className="mt-4 transition-all duration-300">
            <Input 
              placeholder="Search blogs..." 
              className="w-full"
              type="search"
            />
          </div>
        )}

        {isOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 absolute left-4 right-4 top-16 z-50">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  isActive("/") ? "text-primary font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={handleNavigation}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              <Link
                to="/categories"
                className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  isActive("/categories") ? "text-primary font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={handleNavigation}
              >
                <Folder size={18} />
                <span>Categories</span>
              </Link>
              
              {currentUser && (
                <Link
                  to="/saved-blogs"
                  className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive("/saved-blogs") ? "text-primary font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={handleNavigation}
                >
                  <BookmarkCheck size={18} />
                  <span>Saved Blogs</span>
                </Link>
              )}
              
              <div className="py-2 px-3">
                <Input 
                  placeholder="Search blogs..." 
                  className="w-full"
                  type="search"
                />
              </div>

              {currentUser && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    onClick={handleNavigation}
                  >
                    <UserIcon size={18}/>
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to="/create-post" 
                    className="flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    onClick={handleNavigation}
                  >
                    <FolderOpen size={18}/>
                    <span>Create Post</span>
                  </Link>
                  <Link 
                    to="/account-settings" 
                    className="flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    onClick={handleNavigation}
                  >
                    <Settings size={18}/>
                    <span>Account Settings</span>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="flex items-center justify-start gap-2 w-full"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Button>
                </>
              )}
              
              {!currentUser && (
                <Link to="/login" className="w-full" onClick={handleNavigation}>
                  <Button variant="outline" className="flex items-center justify-start gap-2 w-full">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
