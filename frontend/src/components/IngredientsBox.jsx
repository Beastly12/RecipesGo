import React from 'react';

const IngredientsBox = ({ ingredients }) => {
  return (
    <div className=" p-7 mt-9 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
      <h2 className="font-bold text-4xl mb-2 ">Ingredients</h2>
      <ul className="list-disc list-inside text-gray-800 mt-4 mb-4 space-y-10 text-[14px]">
        {ingredients?.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsBox;
