
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";

interface AuthCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Component to conditionally render content based on auth state
export function AuthCheck({ children, fallback }: AuthCheckProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  // Still loading auth state
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  // Authenticated
  return <>{children}</>;
}
