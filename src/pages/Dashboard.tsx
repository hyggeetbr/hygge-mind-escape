
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Not authenticated, redirect to index
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
        <div className="text-hygge-moss text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
      <div className="text-center">
        <h1 className="text-2xl font-display text-hygge-moss mb-4">
          Welcome to Dashboard!
        </h1>
        {user && (
          <p className="text-hygge-earth mb-4">
            You are logged in as: {user.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
