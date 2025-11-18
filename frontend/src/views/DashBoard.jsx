import React, { useEffect, useState } from 'react';
import DashBoardCard from '../components/DashBoardCard';
import { HeartIcon, NotebookPen, Eye, MessageCircleMore } from 'lucide-react';
import DashBoardManagementTable from '../components/DashBoardManagementTable';
import { getUserDetails } from '../services/UserService.mjs';

var userName = 'Daniel';

const hour = new Date().getHours();
const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

const DashBoard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await getUserDetails();
        setStats(data);
      } catch (error) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <section className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] dark:text-[#e4e7eb]">
      <div className="m-2 max-w-[900px] mx-[auto] px-[40px] dark:text-[#fafafa] p-8">
        <div
          className="border flex flex-col 
        bg-[#ff6b6b] text-white 
        dark:bg-gradient-to-br dark:bg-[#1a1a1a] dark:text-[#fafafa]
        rounded-3xl mt-4 mb-2 p-7 space-y-3 
        shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        transition-all duration-300"
        >
          <p className="font-medium text-xl mt-2">Good {greeting}</p>
          <h1 className="font-bold text-4xl mt-2">Welcome back, {userName}! 👋</h1>

          <button
            className="bg-white text-blue-600 
          dark:bg-[#ff6b6b] dark:text-white 
          font-medium rounded-2xl w-40 h-10 p-2 mt-9 
          hover:scale-[1.03] transition-transform duration-300 "
          >
            + Create Recipe
          </button>
        </div>

        {loading ? (
          <p className="text-center mt-6 text-3xl font-medium">Loading Dashboard.....</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            <DashBoardCard
              icon={<NotebookPen className="w-12 h-12 text-yellow-500" />}
              value="47"
              title="Total Recipes"
            />
            <DashBoardCard
              icon={<Eye className="w-12 h-12 text-blue-500" />}
              value="12.5K"
              title="Total Views"
            />
            <DashBoardCard
              icon={<HeartIcon className=" w-12 h-12 text-red-500" />}
              value="346"
              title="Total Comments"
            />
            <DashBoardCard
              icon={<MessageCircleMore className="w-12 h-12 text-purple-500" />}
              value="8,234"
              title="Total Likes"
            />
          </div>
        )}

        <DashBoardManagementTable />
      </div>
    </section>
  );
};

export default DashBoard;
