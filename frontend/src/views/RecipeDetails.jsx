import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Utensils,
  ChartNoAxesColumn,
  Star,
  Heart,
} from "lucide-react";
import { Accordion } from "../components/Accordion";

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

    descriptionSections: [
      {
        id: 1,
        text: "This creamy garlic pasta is inspired by traditional Italian cuisine and made for quick weeknight dinners.",
      },
      {
        id: 2,
        text: "Use freshly grated Parmesan for the best flavor, and don’t overcook the pasta—it should be slightly firm.",
      },
      {
        id: 3,
        text: "Each serving contains approximately 450 calories, 20g protein, 30g fat, and 40g carbs.",
      },
    ],
  };
}

function RecipeDetailPage() {
  const recipe_details = RecipeDetails();

  const [visibleComment, setVisibleComment] = useState(2);

  const handleViewMore = () => {
    setVisibleComment((prev) => prev + 2);
  };

  const visibleComments = recipe_details.comments.slice(0, visibleComment);
  const hasMore = visibleComment < recipe_details.comments.length;

  return (
    <div className="bg-[#fafafa] min-h-screen m-4 text-[#1a1a1a]">
      <div className=" flex flex-col justify-items-center">
        {/* Back Button */}
        <Link
          to={"/"}
          className="flex items-center space-x-5 text-[#1a1a1a] p-2 hover:underline mb-4"
        >
          <ArrowLeft /> <span className="text-2xl">Back</span>
        </Link>
      </div>
      <div className="max-w-[900px] my-[40px] mx-[auto] px-[40px]">
        <div className=" flex flex-col justify-items-center">
          <div>
            {/* Image Card */}
            <div className="rounded-4xl w-full mt-8 mb-8 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
              <img
                className="w-full h-96 object-cover rounded-x"
                src={recipe_details.image}
                alt="Recipe Image"
              />
            </div>
            {/* User Info Card */}
            <h1 className="text-5xl font-semibold mb-5 mt-8 dark:text-white">
              {recipe_details.title}
            </h1>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-2 text-sm text-gray-500 mb-4 mt-6 p-7 shadow-[0_12px_24px_rgba(0,0,0,0.12)] rounded-2xl ">
              <div className="grid grid-cols-1 gap-3 sm:grid-rows-1">
                <Link to={"/profile"}>
                  <p className="font-bold text-xl text-gray-800 px-4 cursor-pointer">
                    {recipe_details.Author}
                  </p>
                </Link>

                <p className="text-sm text-gray-500 mb-2 px-4">
                  {recipe_details.Published}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3">
                {/* Likes Button */}
                <button className="cursor-pointer flex items-center justify-center gap-2 bg-[#ff6b6b] text-white py-2 px-4 sm:px-6 rounded-3xl text-sm hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] transition-all duration-300 w-full">
                  <Heart className="w-5 h-5" />
                  <span>Likes ({recipe_details.Likes})</span>
                </button>

                {/* Favorite Button */}
                <button className="cursor-pointer flex items-center justify-center gap-2 bg-yellow-100 text-yellow-600 border py-2 px-4 sm:px-6 rounded-3xl text-sm hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 w-full">
                  <Star className="w-5 h-5" />
                  <span>Favorite</span>
                </button>

                {/* Share Button */}
                <button className=" cursor-pointer flex items-center justify-center gap-2 bg-gray-100 text-gray-600 border py-2 px-4 sm:px-6 rounded-3xl text-sm hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 w-full">
                  <ExternalLink className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <Accordion sections={recipe_details.descriptionSections} />

            <div className="grid grid- md:grid-cols-2 gap-10 mb-8 mt-15">
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
                    <p className="font-semibold mt-4">
                      {recipe_details.Category}
                    </p>
                  </div>
                  {/* Difficulty Card */}
                  <div className="flex flex-col items-center justify-center bg-gray-50 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                    <ChartNoAxesColumn className="bg-[#ff6b6b] text-white rounded-2xl mx-4" />
                    <p className="font-semibold mt-4">
                      {recipe_details.Difficulty}
                    </p>
                  </div>
                </div>

                {/* Ingredients Box */}
                <div className=" p-7 mt-9 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                  <h2 className="font-bold text-4xl mb-2 ">Ingredients</h2>
                  <ul className="list-disc list-inside text-gray-800 mt-4 mb-4 space-y-10 text-[14px]">
                    {recipe_details.ingredients?.map((ingredients, index) => (
                      <li key={index}>{ingredients}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instruction Box */}
              <div className="p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] mt-6 bg-white">
                <h2 className="font-bold text-4xl mb-4">Instructions</h2>

                <ol className="space-y-10 text-[14px]">
                  {recipe_details.instructions?.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ff6b6b] text-white font-bold">
                        {index + 1}
                      </div>

                      <div className="text-gray-700 leading-relaxed">
                        {instruction}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Comments Box */}
            <div className=" bg-[#fafafa] mt-14 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
              <h2 className="font-bold text-3xl mb-10  text-gray-800">
                Comments ({recipe_details.totalComments})
              </h2>

              {visibleComments?.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg mb-3 border-b border-gray-300"
                >
                  <img
                    src={comment.user.profilePic}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{comment.user.name}</h4>
                    <p className="text-sm text-gray-500">{comment.posted}</p>
                    <p className="mt-1 text-gray-800">{comment.text}</p>
                  </div>
                </div>
              ))}

              {/* View More */}
              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={handleViewMore}
                    className="px-6 py-2 bg-[#ff6b6b] text-white rounded-full hover:bg-[#ff4b4b] transition-all shadow-[0_6px_16px_rgba(255,107,107,0.4)]"
                  >
                    View More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;
