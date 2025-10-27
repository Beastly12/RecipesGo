import React from "react";
import { Link } from "react-router-dom";

const RecipesList = ({ recipes }) => {
  return (
    <>
      <div className="px-10 pb-10 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
        {recipes.map((recipe) => (
          <Link to={"/recipe-details"}>
            <div
              key={recipe.key}
              className="mb-6 bg-white rounded-2xl overflow-hidden break-inside-avoid shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="w-full aspect-[4/3] bg-cover bg-center transition-transform duration-300 hover:scale-105"
                style={{ backgroundImage: `url(${recipe.img})` }}
              ></div>
              <div className="p-4">
                <div className="text-lg font-semibold mb-2">{recipe.title}</div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-300 to-red-400"></div>
                    <span className="text-sm text-gray-600 font-medium">
                      {recipe.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span className="text-[#ff6b6b]">♥</span>
                    <span>{recipe.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className=" flex items-center justify-center py-6">
        <button className="bg-[#ff6b6b] text-white hover:bg-[#ff5252] hover:shadow-[#ff5252]  px-14 py-2 rounded-full font-semibold transition transform hover:-translate-y-0.5 shadow hover:shadow-lg">
          Load More
        </button>
      </div>
    </>
  );
};

export default RecipesList;
