
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-thanos-cosmic-void">
      <div className="cosmic-panel p-8 text-center w-full max-w-md neon-border">
        <h1 className="text-6xl font-orbitron text-thanos-purple-light mb-4">404</h1>
        <p className="text-xl text-white mb-6 font-exo">The path you seek does not exist in this universe</p>
        <a href="/" className="gauntlet-btn inline-block neon-border">
          Return to Reality
        </a>
      </div>
    </div>
  );
};

export default NotFound;
