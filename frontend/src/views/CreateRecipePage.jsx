import React from "react";
import { Link } from "react-router-dom";

const CreateRecipePage = () => {
  return (
    <div className="bg-[#fafafa] text-[#1a1a1a] min-h-screen  dark:bg-[#0a0a0a] dark:text-[#e5e5e5] font-sans">
      <nav className="bg-white px-10 py-4 shadow-sm dark:bg-[#0a0a0a] dark:text-[#e5e5e5] sticky top-0 z-50 flex items-center justify-between">
        <Link to={"/"} className="text-xl font-semibold dark:text-[#e5e5e5]">
          ← Cancel
        </Link>

        <Link to={"/recipe-details"}>
          <div className="flex items-center gap-4">
            <button className="bg-[#ff6b6b] text-white hover:bg-[#ff5252] hover:shadow-[#ff5252] dark:bg-[#ff5252] dark:hover:bg-[#ff6b6b] px-6 py-3 rounded-xl font-semibold transition transform hover:-translate-y-0.5 shadow hover:shadow-lg">
              Publish Recipe
            </button>
          </div>
        </Link>
      </nav>

      <div className="lg:max-w-[900px] py-[40px] lg:mx-[auto] px-[20px] lg:px-[40px] ">
        <h1 className="text-4xl my-10 font-bold dark:text-white">Create New Recipe</h1>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Recipe Image
          </div>
          <div className="border-dashed border-[#dee2e6] border-2 rounded-2xl py-[60px] px-[20px] text-center cursor-pointer transition-all bg-[#f8f9fa] hover:border-[#ff6b6b] hover:bg-[#fff5f5] dark:border-gray-600 dark:bg-[#0a0a0a] dark:hover:border-[#ff5252] dark:hover:bg-[#2a0a0a]">
            <div className="text-5xl mb-[14px]">📸</div>
            <div className="text-[16px] font-medium text-[#495057] dark:text-gray-300">
              Click to upload recipe photo
            </div>
            <div className="text-sm mt-2 text-[#868e96] dark:text-gray-500">
              JPG, PNG or WEBP (max 5MB)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Basic Information
          </div>
          <div className="mb-6">
            <label className="dark:text-gray-200">Recipe Title</label>
            <input type="text" placeholder="Enter recipe name..." className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500" />
          </div>

          <div className="mb-6">
            <label className="dark:text-gray-200">Description</label>
            <textarea placeholder="Tell us about your recipe..." className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500"></textarea>
          </div>

          <div className="grid gap-4 grid-cols-3">
            <div className="mb-6">
              <label className="dark:text-gray-200">Cook Time (minutes)</label>
              <input type="number" placeholder="30" className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500" />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-3">
            <div className="mb-6">
              <label className="dark:text-gray-200">Difficulty</label>
              <select className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="dark:text-gray-200">Category</label>
              <select className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600">
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Dessert</option>
                <option>Snack</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Ingredients
          </div>
          <div className="flex gap-3 items-start">
            <input
              className="flex-1 dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500"
              type="text"
              placeholder="e.g., 2 cups of flour"
            />
            <button className="py-[12px] px-[16px] bg-[#f8f9fa] rounded-lg cursor-pointer dark:bg-gray-700 dark:text-white">
              ✕
            </button>
          </div>
          <div>
            <button className="border-dashed mt-2 border-[#dee2e6] text-sm font-semibold text-[#495057] px-2 py-1 border-2 rounded-[6px] bg-[#f8f9fa] dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700">
              + Add Ingredient
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Instructions
          </div>
          <div className="flex gap-3 items-start">
            <div className="bg-[#ff6b6b] rounded-full px-3 py-1 text-white font-semibold dark:bg-[#ff5252]">
              <label>1</label>
            </div>
            <textarea
              className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500"
              placeholder="e.g., 2 cups of flour"
            ></textarea>
            <button className="py-[50px] px-[16px] bg-[#f8f9fa] rounded-lg cursor-pointer dark:bg-gray-700 dark:text-white">
              ✕
            </button>
          </div>
          <div className="mt-2">
            <button className="border-dashed mt-2 border-[#dee2e6] text-sm font-semibold text-[#495057] px-2 py-1 border-2 rounded-[6px] bg-[#f8f9fa] dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700">
              + Add Step
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Privacy Settings
          </div>
          <div className="flex gap-3">
            <div className="flex-1 border-[#dee2e6] border-2 rounded-2xl py-[40px] px-[20px] text-center cursor-pointer transition-all bg-[#f8f9fa] hover:border-[#ff6b6b] hover:bg-[#fff5f5] dark:border-gray-600 dark:bg-[#0a0a0a] dark:hover:border-[#ff5252] dark:hover:bg-[#2a0a0a]">
              <div className="text-5xl mb-[14px]">🌍</div>
              <div className="text-[16px] font-medium text-[#495057] dark:text-gray-300">
                Public
              </div>
              <div className="text-sm mt-2 text-[#868e96] dark:text-gray-500">
                Anyone can view this recipe
              </div>
            </div>

            <div className="flex-1 border-[#dee2e6] border-2 rounded-2xl py-[40px] px-[20px] text-center cursor-pointer transition-all bg-[#f8f9fa] hover:border-[#ff6b6b] hover:bg-[#fff5f5] dark:border-gray-600 dark:bg-[#0a0a0a] dark:hover:border-[#ff5252] dark:hover:bg-[#2a0a0a]">
              <div className="text-5xl mb-[14px]">🔒</div>
              <div className="text-[16px] font-medium text-[#495057] dark:text-gray-300">
                Private
              </div>
              <div className="text-sm mt-2 text-[#868e96] dark:text-gray-500">
                only you can view this recipe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;