import React, { useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import RecipesList from "../components/RecipeList";
import { Link } from "react-router-dom";

var rData = [
  {
    key: 0,
    title: "Chocolate Chip Cookies",
    author: "Lis Park",
    likes: 183,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600",
  },
  {
    key: 1,
    title: "Creamy Mushroom Pasta",
    author: "Sara Chen",
    likes: 189,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
  {
    key: 2,
    title: "Fresh Garden Salad Bowl",
    author: "Sara Chen",
    likes: 103,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
  {
    key: 3,
    title: "Creamy Mushroom Pasta",
    author: "Sara Chen",
    likes: 203,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
];

const profileBio = [
  {
    id: 1,
    name: "Emma Rossi",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Home chef & food enthusiast sharing my favorite comfort food recipes. Passionate about Italian cuisine and creating simple, delicious meals for everyday cooking.",
    recipesCount: 24,
    totalLikes: 12.5,
  },
];

export default function Profile() {
  const profile = profileBio[0];
  const [activeTab, setActiveTab] = useState("myRecipes");

  return (
    <div className="min-h-screen  bg-[#fafafa] m-4 text-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-[#fafafa]">
      <Link to="/recipe-details">
        <div className="flex m-4 p-3 space-x-3">
          <ArrowLeft className="cursor-pointer" />
          <button className=" text-xl font-medium cursor-pointer hover:underline md:font-light">
            Back
          </button>
        </div>
      </Link>

      <div className="max-w-[900px] my-[40px] mx-[auto] px-[40px]">
        <div className="w-full rounded-2xl mb-6 flex space-x-2">
          <div className="mt-8 mb-8 p-8 mr-5">
            <img
              className=" rounded-full border-1 w-200 object-cover sm:rounded-full md:rounded-full"
              src={profile.img}
              alt="Profile Image"
            />
          </div>

          <div className="md:space-y-10  sm:space-x-2 m-6 p- ">
            <h3 className="font-bold text-5xl">{profile.name}</h3>
            <p className="text-[16px] sm:text-[12px] md:text-[16px] mt-4 items-center">
              {profile.bio}
            </p>

            <div className="flex items-center space-x-7 mt-8">
              <div>
                <p className="font-bold text-xl">{profile.recipesCount}</p>
                <p className="text-[#1a1a1a] dark:text-[#fafafa] text-xl">
                  Recipes
                </p>
              </div>
              <div>
                <p className="font-bold text-xl">{profile.totalLikes}K</p>
                <p className="text-[#1a1a1a] dark:text-[#fafafa] text-xl">
                  Total Likes
                </p>
              </div>
            </div>

            <button className="font-bold flex items-center bg-[#ff6b6b] text-white hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] transition-all duration-300 rounded-xl p-3 mt-4 ">
              <Settings size={16} strokeWidth={1.75} />
              Settings
            </button>
          </div>
        </div>

        <div className="flex space-x-20 mt-4 text-[#1a1a1a] border-b-1 border-b-gray-600">
          <button
            onClick={() => setActiveTab("myRecipes")}
            className={`cursor-pointer pb-2 border-b-2 ${
              activeTab === "myRecipes"
                ? "border-b-[#ff6b6b] border-b-3"
                : "border-b-transparent hover:border-b-gray-600"
            }`}
          >
            My Recipes
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`cursor-pointer pb-2 border-b-2 ${
              activeTab === "favorites"
                ? "border-b-[#ff6b6b] border-b-3"
                : "border-b-transparent hover:border-b-gray-600"
            }`}
          >
            Favorites
          </button>
        </div>

        <div className="m-10 mt-20">
          <RecipesList recipes={rData} />
        </div>
      </div>
    </div>
  );
}
