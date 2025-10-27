import React from "react";
import FilterTab from "../components/FilterTab";
import RecipesList from "../components/RecipeList";
import { Sun, Moon } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode"
import HeroSection from "../components/HeroSection";
import { Link } from "react-router-dom";

export default function RecipeFeed() {
  var fData = [
    {
      key: 0,
      title: "All",
    },
    {
      key: 1,
      title: "Breakfast",
    },
    {
      key: 2,
      title: "Lunch",
    },
    {
      key: 3,
      title: "Dinner",
    },
    {
      key: 4,
      title: "Desserts",
    },
    {
      key: 5,
      title: "Snacks",
    },
    {
      key: 6,
      title: "Vegan",
    },
    {
      key: 7,
      title: "Quick & Easy",
    },
  ];
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
      author: " Sara Chen",
      likes: 189,
      profilePic: "",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    },
    {
      key: 2,
      title: "Fresh Garden Salad Bowl",
      author: " Sara Chen",
      likes: 103,
      profilePic: "",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    },
    {
      key: 3,
      title: "Creamy Mushroom Pasta",
      author: " Sara Chen",
      likes: 203,
      profilePic: "",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    },
  ];

  const [colorTheme, setTheme] = useDarkMode();

  return (
<div className="bg-[#fafafa] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#fafafa] min-h-screen font-sans transition-colors duration-300">
      <nav className="bg-white px-10 py-4 shadow-sm sticky top-0 z-50 flex items-center justify-between">
        <Link to={"/"} className="text-2xl font-bold text-[#ff6b6b]">P Prepify</Link>

        <div className="flex-1 max-w-xl mx-10 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search recipes, ingredients, or chefs..."
            className="w-full pl-13 pr-4 py-3 rounded-full border-2 border-gray-200 text-sm focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20"
          />
        </div>

        <div className="flex items-center gap-4">
          <span onClick={() => setTheme(colorTheme)}>
            {colorTheme === "dark" ? <Sun /> : <Moon />}
          </span>
          <button className="bg-[#ff6b6b] text-white hover:bg-[#ff5252] hover:shadow-[#ff5252]  px-6 py-2 rounded-full font-semibold transition transform hover:-translate-y-0.5 shadow hover:shadow-lg">
            + Create Recipe
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 cursor-pointer hover:scale-105 transition-transform"></div>
        </div>
      </nav>
      <HeroSection/>
      <div className="sticky top-[5rem] z-30 bg-[#fafafa] dark:bg-[#1a1a1a] transition-colors duration-300 ">
        <FilterTab filterData={fData} />
      </div>
      <RecipesList recipes={rData} />
    </div>
  );
}
