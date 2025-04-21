
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, logoutUser } from "@/lib/firebase";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LayoutDashboard, LogIn, LogOut, User as UserIcon, PenSquare } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Handle scroll effect for navbar
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
      await logoutUser();
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close mobile menu when changing route
  const handleNavigation = () => {
    setIsOpen(false);
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
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Vaidpr
          </Link>

          {/* Desktop Navigation */}
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
            
            {currentUser && (
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-1 transition-colors hover:text-primary ${
                  isActive("/dashboard") ? "text-primary font-medium" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            )}
            
            {currentUser && (
              <Link 
                to="/create-post" 
                className={`flex items-center gap-1 transition-colors hover:text-primary ${
                  isActive("/create-post") ? "text-primary font-medium" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <PenSquare size={16} />
                <span>New Post</span>
              </Link>
            )}
            
            {currentUser ? (
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-1">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-1">
                  <LogIn size={16} />
                  <span>Login</span>
                </Button>
              </Link>
            )}
            
            {currentUser && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <UserIcon size={16} />
                <span className="truncate max-w-[120px]">{currentUser.email}</span>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile Navigation */}
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
              
              {currentUser && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive("/dashboard") ? "text-primary font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={handleNavigation}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
              )}
              
              {currentUser && (
                <Link
                  to="/create-post"
                  className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive("/create-post") ? "text-primary font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={handleNavigation}
                >
                  <PenSquare size={18} />
                  <span>New Post</span>
                </Link>
              )}
              
              {currentUser ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center justify-start gap-2 w-full"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              ) : (
                <Link to="/login" className="w-full" onClick={handleNavigation}>
                  <Button variant="outline" className="flex items-center justify-start gap-2 w-full">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Button>
                </Link>
              )}
              
              {currentUser && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 py-2 px-3">
                  <UserIcon size={16} />
                  <span className="truncate">{currentUser.email}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
