import React from 'react';

const IngredientsBox = ({ ingredients }) => {
  return (
    <div className="p-6 lg:p-7 rounded-2xl shadow dark:shadow-lg dark:shadow-black/50 bg-white dark:bg-[#1a1a1a]">
      <h2 className="font-bold text-2xl lg:text-3xl mb-6 text-gray-800 dark:text-white">
        Ingredients
      </h2>
      <ul className="space-y-3 text-sm lg:text-base">
        {ingredients?.map((ingredient, index) => (
          <li 
            key={index} 
            className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
          >
            <span className="text-[#ff6b6b] dark:text-[#ff8080] mt-1.5 text-lg">•</span>
            <span className="leading-relaxed">{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsBox;