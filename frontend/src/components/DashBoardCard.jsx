import React from 'react';

const DashBoardCard = ({ icon, value, title }) => {
  return (
    <div
      className="relative overflow-hidden 
        p-6 rounded-2xl transition-all duration-300 
        border border-gray-200
        shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] 
        bg-white dark:bg-[#1a1a1a]
        hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]
        hover:border-[rgba(255,107,107,0.3)] dark:border-gray-500"
    >
      <div className="relative z-10 flex flex-col items-start">
        <div className="p-2">{icon}</div>

        <div className="mt-5">
          <p className="font-bold text-4xl dark:text-white">{value}</p>
          <p className="text-[14px] text-gray-500 dark:text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default DashBoardCard;
