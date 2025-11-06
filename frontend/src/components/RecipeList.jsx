import React from "react";
import { Link } from "react-router-dom";

const RecipesList = ({ recipes }) => {
  return (
    <>
      <div className="px-10 mt-2 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <Link to="/recipe-details" key={recipe.key}>
            <div className="mb-6 bg-white dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50 rounded-2xl overflow-hidden shadow hover:shadow-xl transition-transform duration-300 ease-out hover:-translate-y-1 cursor-pointer">
              <div className="overflow-hidden">
                <div
                  className="w-full aspect-4/3 bg-cover bg-center transition-transform duration-300 ease-out hover:scale-105 will-change-transform"
                  style={{
                    backgroundImage: `url(${recipe.img})`,
                    transform: "translateZ(0)",
                  }}
                ></div>
              </div>

              <div className="p-4">
                <div className="text-lg font-semibold mb-2 dark:text-gray-600">
                  {recipe.title}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-pink-300 to-red-400"></div>
                    <span className="text-sm text-gray-600 font-medium">
                      {recipe.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span className="text-[#ff6b6b] ">♥</span>
                    <span>{recipe.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center py-6">
        <button className="bg-[#ff6b6b] text-white hover:bg-[#ff5252] hover:shadow-[#ff5252] px-14 py-2 rounded-full font-semibold transition-transform duration-300 ease-out hover:-translate-y-0.5 shadow hover:shadow-lg">
          Load More
        </button>
      </div>
    </>
  );
};

export default RecipesList;
