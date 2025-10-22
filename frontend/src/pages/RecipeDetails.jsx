import React from "react";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Utensils,
  ChartNoAxesColumn,
  Star,
  Heart,
} from "lucide-react";
import { FaHeart } from "react-icons/fa";

function RecipeDetails() {
  return {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
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

    totalComments: 12,
    comments: [
      {
        id: 1,
        user: {
          name: "Mike Johnson",
          profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        posted: "1 day ago",
        text: "Made this last night and it was absolutely delicious! The sauce was so creamy and flavorful. I added a bit of white wine which really elevated it. Will definitely make again!",
      },
      {
        id: 2,
        user: {
          name: "Samantha Lee",
          profilePic: "https://randomuser.me/api/portraits/women/45.jpg",
        },
        posted: "2 days ago",
        text: "This was such a comforting meal. I replaced the cream with oat milk and it still turned out amazing.",
      },
      {
        id: 3,
        user: {
          name: "David Kim",
          profilePic: "https://randomuser.me/api/portraits/men/56.jpg",
        },
        posted: "3 days ago",
        text: "Simple, quick, and super tasty. Perfect for a weeknight dinner!",
      },
      {
        id: 4,
        user: {
          name: "Emily Carter",
          profilePic: "https://randomuser.me/api/portraits/women/67.jpg",
        },
        posted: "4 days ago",
        text: "I doubled the garlic because I’m a garlic lover! Turned out heavenly!",
      },
    ],
  };
}

function RecipeDetailPage() {
  const recipe_details = RecipeDetails();

  return (
    <div className="bg-[#fafafa] min-h-screen m-9 text-[#1a1a1a]">
      <div className=" flex flex-col justify-items-center">
        {/* Back Button */}
        <button className="flex items-center space-x-5 text-[#1a1a1a] p-2 hover:underline mb-4">
          <ArrowLeft /> <span className="text-2xl">Back</span>
        </button>

        {/* Image Card */}
        <div className="rounded-4xl w-full mt-8 mb-8 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
          <img
            className="w-full h-96 object-cover rounded-xl"
            src={recipe_details.image}
            alt="Recipe Image"
          />
        </div>
      </div>

      {/* User Info Card */}
      <h1 className="text-5xl font-semibold mb-5 mt-8">
        {recipe_details.title}
      </h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-2 text-sm text-gray-500 mb-4 mt-6 p-7 shadow-[0_12px_24px_rgba(0,0,0,0.12)] rounded-2xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-rows-1">
          <p className="font-bold text-xl text-gray-800 px-4">
            {recipe_details.Author}
          </p>
          <p className="text-sm text-gray-500 mb-2 px-4">
            {recipe_details.Published}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3">
          {/* Likes Button */}
          <button className="flex items-center justify-center gap-2 bg-[#ff6b6b] text-white py-2 px-4 sm:px-6 rounded-3xl text-sm hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] transition-all duration-300 w-full">
            <Heart className="w-5 h-5" />
            <span>Likes ({recipe_details.Likes})</span>
          </button>

          {/* Favorite Button */}
          <button className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-600 border py-2 px-4 sm:px-6 rounded-3xl text-sm hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 w-full">
            <Star className="w-5 h-5" />
            <span>Favorite</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 border py-2 px-4 sm:px-6 rounded-3xl text-sm hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 w-full">
            <ExternalLink className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 mt-15">
        <div>
          <div className=" grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-6">
            {/* Time Card */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
              <div>
                <Clock className="bg-[#ff6b6b] text-white rounded-2xl" />
              </div>
              <p className="font-semibold mt-4">{recipe_details.Time}</p>
            </div>
            {/* Category Card */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
              <Utensils className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
              <p className="font-semibold mt-4">{recipe_details.Category}</p>
            </div>
            {/* Difficulty Card */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
              <ChartNoAxesColumn className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
              <p className="font-semibold mt-4">{recipe_details.Difficulty}</p>
            </div>
          </div>

          {/* Ingredients Box */}
          <div className=" p-7 mt-9 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
            <h2 className="font-medium text-4xl mb-2 ">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-700 mt-4 mb-4">
              {recipe_details.ingredients?.map((ingredients, index) => (
                <li key={index}>{ingredients}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instruction Box */}
        <div className="">
          <div className="p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
            <h2 className="font-medium text-4xl mb-2">Instructions</h2>
            <ol className="list-decimal list-inside text-gray-700">
              {recipe_details.instructions?.map((instructions, index) => (
                <li key={index}>{instructions}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Comments Box */}
      <div className=" bg-[#fafafa] mt-14 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
        <h2 className="font-bold text-2xl">
          Comments ({recipe_details.totalComments})
        </h2>

        <div>
          <img src={recipe_details.profilePic} />
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;
