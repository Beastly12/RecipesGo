import React from "react";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Utensils,
  ChartNoAxesColumn,
} from "lucide-react";

function RecipeDetails() {
  return {
    image: (
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
        alt="Recipe"
        className="w-full h-96 object-cover rounded-xl"
      />
    ),
    title: "Creamy Garlic Pasta",
    Author: "Chef Olivia Martinez",
    Published: "October 12, 2025",
    Likes: 256,
    Time: "30 mins",
    Category: "Italian Cuisine",
    Difficulty: "Intermediate",

    ingredients: [
      "200g spaghetti",
      "3 cloves garlic, minced",
      "1 cup heavy cream",
      "1/2 cup grated parmesan",
      "2 tbsp olive oil",
      "Salt and pepper to taste",
      "Chopped parsley for garnish",
    ],

    instructions: [
      "Boil pasta until al dente, then drain.",
      "In a skillet, sauté garlic in olive oil until fragrant.",
      "Add heavy cream and simmer for 5 minutes.",
      "Stir in parmesan cheese and cooked pasta.",
      "Season with salt and pepper.",
      "Garnish with parsley and serve warm.",
    ],
  };
}

function RecipeDetailPage() {
  const recipe_details = RecipeDetails();

  return (
    <div className="bg-[#fafafa] min-h-screen m-9 text-[#1a1a1a]">
      <div className=" flex flex-col justify-items-center">
        <button className="flex items-center space-x-5 text-[#1a1a1a] p-2 hover:underline mb-4">
          <ArrowLeft /> <span className="text-2xl">Back</span>
        </button>

        <div className="rounded-4xl w-full mt-8 mb-8 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
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

          <p className="text-sm text-gray-500 px-4">
            {recipe_details.Published}
          </p>
        </div>

        <div className="flex gap-5">
          <button className="bg-[#ff6b6b] text-white p-5 pr-12 pl-2 border rounded-3xl text-sm hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] transition-all duration-300">
            ❤️ Like ({recipe_details.Likes})
          </button>

          <button className="bg-yellow-100 text-yellow-600 border px-12 py-1 rounded-3xl text-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
            ⭐ Favoriteww
          </button>

          <button className="bg-gray-100 text-gray-600 border px-20 py-3 rounded-3xl text-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
            <ExternalLink className="text-sm" /> Share
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-7 mb-6 mt-15">
        <div className="bg-gray-50 px-15 py-7 rounded-2xl text-center shadow-[0_12px_24px_rgba(0,0,0,0 pl-">
          <Clock className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
          <p className="font-semibold mt-4">{recipe_details.Time}</p>
        </div>
        <div className="bg-gray-50 px-15 py-7 rounded-2xl text-center shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
          <Utensils className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
          <p className="font-semibold mt-4">{recipe_details.Category}</p>
        </div>
        <div className="bg-gray-50 px-15 py-7 rounded-2xl text-center shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
          <ChartNoAxesColumn className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
          <p className="font-semibold mt-4">{recipe_details.Difficulty}</p>
        </div>
      </div>
      w
    </div>
  );
}

export default RecipeDetailPage;
