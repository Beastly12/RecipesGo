import React from 'react';

const InstructionBox = ({ instructions }) => {
  return (
    <div className="p-6 lg:p-7 rounded-2xl shadow dark:shadow-lg dark:shadow-black/50 bg-white dark:bg-[#1a1a1a]">
      <h2 className="font-bold text-2xl lg:text-3xl mb-6 text-gray-800 dark:text-white">
        Instructions
      </h2>
      <ol className="space-y-6 text-sm lg:text-base">
        {instructions?.map((instruction, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="flex items-center justify-center min-w-[32px] w-8 h-8 rounded-full bg-[#ff6b6b] dark:bg-[#ff6b6b]/70 text-white font-bold text-sm shadow-sm">
              {index + 1}
            </div>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">
              {instruction}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default InstructionBox;