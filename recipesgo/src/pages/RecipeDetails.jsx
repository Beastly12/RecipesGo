import React from "react";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Utensils,
  ChartNoAxesColumn,
} from "lucide-react";

function RecipeDetailPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen m-8">
      <div className=" flex flex-col justify-items-center">
        <button className="flex items-center space-x-5 text-[#1a1a1a] p-2 hover:underline mb-4">
          <ArrowLeft /> <span className="text-2xl">Back</span>
        </button>

        <div className="rounded-xl w-full mt-8 mb-8 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
          {<input type="file" className="p-30 text-[#1a1a1a] font-medium" />}
          {recipe_details.image}
        </div>
      </div>

      <h1 className="text-5xl font-semibold mb-3 mt-8">
        {recipe_details.title}
      </h1>

      <div className="flex flex-row justify-between text-sm text-gray-500 mb-4 mt-6 p-7 shadow-[0_12px_24px_rgba(0,0,0,0.12)] rounded-2xl">
        <div className="flex flex-col justify-between">
          <p className="font-bold text-xl text-gray-800 px-4">
            {recipe_details.Author}
          </p>
          1
          <p className="text-sm text-gray-500 px-4">
            {" "}
            {recipe_details.Published}
          </p>
        </div>

        <div className="flex gap-5">
          <button className="bg-[#ff6b6b] text-white p-5 pr-20 rounded-3xl text-sm hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] transition-all duration-300">
            ❤️ Like ({recipe_details.Likes})
          </button>

          <button className="bg-yellow-100 text-yellow-600 px-12 py-1 rounded-3xl text-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
            ⭐ Favorite
          </button>

          <button className="bg-gray-100 text-gray-600 px-20 py-3 rounded-3xl text-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
            <ExternalLink className="text-sm" /> Share
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-7 mb-6 mt-15">
        <div className="bg-gray-50 px-15 py-7 rounded-2xl text-center shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
          <Clock className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
          <p className="font-semibold mt-4">{recipe_details.Time}</p>
        </div>
        <div className="bg-gray-50 px-15 py-7 rounded-2xl text-center shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
          <Utensils className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
          <p className="font-semibold mt-4">{recipe_details.Category}</p>
        </div>
        <div className="bg-gray-50 px-15 py-7 rounded-2xl text-center shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
          <ChartNoAxesColumn className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
          <p className="font-semibold mt-4">{recipe_details.Difficult}</p>
        </div>
      </div>

      <div className="flex gap-200 md:grid mt-5">
        <div>
          <h2 className="font-medium text-4xl">Ingredients</h2>
          <ul className="list-disc list-inside text-gray-700">
            {recipe.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-medium text-4xl">Instruction</h2>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;
