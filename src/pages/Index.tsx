
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to HomePage component
    navigate("/", { replace: true });
  }, [navigate]);

  return null; // This component just redirects, no need to render anything
};

export default Index;
