import React from "react";
import { Link } from "react-router-dom";

const CreateRecipePage = () => {
  return (
    <div className="bg-[#fafafa] text-[#1a1a1a] min-h-screen font-sans ">
      <nav className="bg-white px-10 py-4 shadow-sm sticky top-0 z-50 flex items-center justify-between">
        <Link to={"/"} className="text-xl font-semibold ">
          ← Cancel
        </Link>

        <Link to={"/recipe-details"}>
          <div className="flex items-center gap-4">
            {/* <button className="bg-white border text-[#495057] border-[#e9ecef]  hover:bg-[#f8f9fa]  px-6 py-3 rounded-xl font-semibold transition transform">
                        Save Draft
                    </button> */}

            <button className="bg-[#ff6b6b] text-white hover:bg-[#ff5252] hover:shadow-[#ff5252]  px-6 py-3 rounded-xl font-semibold transition transform hover:-translate-y-0.5 shadow hover:shadow-lg">
              Publish Recipe
            </button>
          </div>
        </Link>
      </nav>

      <div className="max-w-[900px] my-[40px] mx-[auto] px-[40px]  ">
        <h1 className=" text-4xl my-10 font-bold   ">Create New Recipe</h1>

        <div className=" bg-white rounded-2xl p-8 mb-6 shadow">
          <div className=" text-[20px] font-bold mb-5 text-[#1a1a1a] ">
            Recipe Image
          </div>
          <div
            className=" border-dashed border-[#dee2e6] border-2  rounded-2xl py-[60px] px-[20px] 
                    text-center cursor-pointer transition-all bg-[#f8f9fa] hover:border-[#ff6b6b] hover:bg-[#fff5f5] "
          >
            <div className=" text-5xl mb-[14px]">📸</div>
            <div className=" text-[16px] font-medium text-[#495057]">
              Click to upload recipe photo
            </div>
            <div className=" text-sm mt-2 text-[#868e96]">
              JPG, PNG or WEBP (max 5MB)
            </div>
          </div>
        </div>

        <div className=" bg-white rounded-2xl p-8 mb-6 shadow">
          <div className=" text-[20px] font-bold mb-5 text-[#1a1a1a] ">
            Basic Information
          </div>
          <div className=" mb-6">
            <label>Recipe Title</label>
            <input type="text" placeholder="Enter recipe name..." />
          </div>

          <div className="mb-6">
            <label>Description</label>
            <textarea placeholder="Tell us about your recipe..."></textarea>
          </div>

          <div className=" grid gap-4 grid-cols-3">
            <div className="mb-6">
              <label>Cook Time (minutes)</label>
              <input type="number" placeholder="30" />
            </div>
          </div>

          <div className=" grid gap-4 grid-cols-3">
            <div className="mb-6">
              <label>Difficulty</label>
              <select>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="mb-6">
              <label>Category</label>
              <select>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Dessert</option>
                <option>Snack</option>
              </select>
            </div>
          </div>
        </div>

        <div className=" bg-white rounded-2xl p-8 mb-6 shadow">
          <div className=" text-[20px] font-bold mb-5 text-[#1a1a1a] ">
            Ingredients
          </div>
          <div className="flex gap-3 items-start ">
            <input
              className="flex-1"
              type="text"
              placeholder="e.g., 2 cups of flour"
            ></input>
            <button className=" py-[12px] px-[16px] bg-[#f8f9fa] rounded-lg cursor-pointer">
              ✕
            </button>
          </div>
          <div>
            <button className=" border-dashed mt-2 border-[#dee2e6] text-sm font-semibold text-[#495057] px-2 py-1 border-2 rounded-[6px] bg-[#f8f9fa]  ">
              + Add Ingredient
            </button>
          </div>
        </div>

        <div className=" bg-white rounded-2xl p-8 mb-6 shadow">
          <div className=" text-[20px] font-bold mb-5 text-[#1a1a1a] ">
            Instructions
          </div>
          <div className="flex gap-3 items-start ">
            <div className=" bg-[#ff6b6b] rounded-full px-3 py-1 text-white font-semibold ">
              <label>1</label>
            </div>
            <textarea
              className=""
              placeholder="e.g., 2 cups of flour"
            ></textarea>
            <button className=" py-[50px] px-[16px] bg-[#f8f9fa] rounded-lg cursor-pointer">
              ✕
            </button>
          </div>
          <div className=" mt-2">
            <button className=" border-dashed mt-2 border-[#dee2e6] text-sm font-semibold text-[#495057] px-2 py-1 border-2 rounded-[6px] bg-[#f8f9fa]  ">
              + Add Step
            </button>
          </div>
        </div>

        <div className=" bg-white rounded-2xl p-8 mb-6 shadow">
          <div className=" text-[20px] font-bold mb-5 text-[#1a1a1a] ">
            Privacy Settings
          </div>
          <div className="flex gap-3 ">
            <div
              className=" flex-1  border-[#dee2e6] border-2  rounded-2xl py-[40px] px-[20px] 
                    text-center cursor-pointer transition-all bg-[#f8f9fa] hover:border-[#ff6b6b] hover:bg-[#fff5f5] "
            >
              <div className=" text-5xl mb-[14px]">🌍</div>
              <div className=" text-[16px] font-medium text-[#495057]">
                Public
              </div>
              <div className=" text-sm mt-2 text-[#868e96]">
                Anyone can view this recipe
              </div>
            </div>

            <div
              className=" flex-1 border-[#dee2e6] border-2  rounded-2xl py-[40px] px-[20px] 
                    text-center cursor-pointer transition-all bg-[#f8f9fa] hover:border-[#ff6b6b] hover:bg-[#fff5f5] "
            >
              <div className=" text-5xl mb-[14px]">🔒</div>
              <div className=" text-[16px] font-medium text-[#495057]">
                Private
              </div>
              <div className=" text-sm mt-2 text-[#868e96]">
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
