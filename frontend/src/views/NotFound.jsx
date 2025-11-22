import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useState, useEffect } from 'react';

const NotFound = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton layout
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] dark:bg-[#0a0a0a]">
        <div className="text-center px-4 animate-pulse">
          <div className="mb-4 h-24 w-48 bg-[#ff6b6b] mx-auto rounded-md"></div>
          <div className="mb-2 h-10 w-64 bg-gray-700 dark:bg-gray-800 mx-auto rounded-md"></div>
          <div className="mb-8 h-6 w-80 bg-gray-600 dark:bg-gray-700 mx-auto rounded-md"></div>
          <div className="h-12 w-40 bg-[#ff6b6b] mx-auto rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] dark:bg-[#0a0a0a]">
      <div className="text-center px-4">
        <h1 className="mb-4 text-8xl font-serif font-bold text-[#ff6b6b]">404</h1>
        <p className="mb-2 text-3xl font-semibold text-white">Page Not Found</p>
        <p className="mb-8 text-lg text-gray-400 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/">
          <button className="flex items-center justify-center bg-[#ff6b6b] text-white px-6 py-3 rounded-xl hover:bg-[#ff5252] transition-colors mx-auto">
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
