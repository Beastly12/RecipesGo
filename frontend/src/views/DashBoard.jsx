import React from "react";
import DashBoardCard from "../components/DashBoardCard";
import { HeartIcon, NotebookPen, Eye, MessageCircleMore } from "lucide-react";
import DashBoardManagementTable from "../components/DashBoardManagementTable";

var userName = "Daniel";

const hour = new Date().getHours();
let greeting = "";
if (hour < 12) {
  greeting = "morning";
} else if (hour < 18) {
  greeting = "afternoon";
} else {
  greeting = "evening";
}


const DashBoard = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] dark:bg-[#0a0e27] dark:text-[#e4e7eb]">
      <div className="m-2 max-w-[900px] my-[40px] mx-[auto] px-[40px] dark:text-[#fafafa]">
        <div
          className="border flex flex-col 
        bg-[#ff6b6b] text-white 
        dark:bg-gradient-to-br dark:from-[#1a2142] dark:to-[#151b35] dark:text-[#fafafa]
        rounded-3xl mt-4 mb-2 p-7 space-y-3 
        shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        transition-all duration-300"
        >
          <p className="font-medium text-xl mt-2">Good {greeting}</p>
          <h1 className="font-bold text-4xl mt-2">
            Welcome back, {userName}! 👋
          </h1>
          
          <button
            className="bg-white text-blue-600 
          dark:bg-[#ff6b6b] dark:text-white 
          font-medium rounded-2xl w-40 h-10 p-2 mt-9 
          hover:scale-[1.03] transition-transform duration-300 "
          >
            + Create Recipe
          </button>
        </div>

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

        <DashBoardManagementTable/>
      </div>
    </section>
  );
};

export default DashBoard;
