import React, { useEffect, useState } from "react";
import FilterTab from "../components/FilterTab";
import RecipesList from "../components/RecipeList";
import { Sun, Moon } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";
import HeroSection from "../components/HeroSection";
import { Link } from "react-router-dom";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { getAllRecipes } from "../services/RecipesService.mjs";

export default function RecipeFeed() {
  const [userId, setUserId] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { userId } = await getCurrentUser();
      console.log(userId);
      setUserId(userId);
      const session = await fetchAuthSession();

      console.log("id token", session.tokens.idToken.toString());
      console.log("access token", session.tokens.accessToken.toString());
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getAllRecipes();
        const data = response.data.message.map((recipe) => ({
          key: recipe.id,
          title: recipe.name,
          author: recipe.authorName,
          likes: 2,
          profilePic:
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600",
          img: recipe.imageUrl,
        }));
        console.log(data)
        setRecipes((prev) => [...prev, ...data]);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

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

  const [colorTheme, setTheme] = useDarkMode();

  return (
    <div className="bg-[#fafafa] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#fafafa] min-h-screen font-sans transition-colors duration-300">
      {/* Desktop Navigation */}
      <nav className="bg-white hidden md:flex dark:bg-[#1a1a1a] px-10 py-4 shadow-sm sticky top-0 z-50  items-center justify-between">
        <Link
          to={"/"}
          className="text-2xl font-bold text-[#ff6b6b] dark:text-[#ff8080]"
        >
          P Prepify
        </Link>

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
          <Link
            to={"/createRecipe"}
            className="bg-[#ff6b6b] text-white hover:bg-[#ff5252] hover:shadow-[#ff5252]  px-6 py-2 rounded-full font-semibold transition transform hover:-translate-y-0.5 shadow hover:shadow-lg"
          >
            + Create Recipe
          </Link>
          {userId ? (
            <Link to={"/Settings"}>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 cursor-pointer hover:scale-105 transition-transform"></div>
            </Link>
          ) : (
            <div>Login/Signup</div>
          )}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-[#1a1a1a] px-4 py-3 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={"/"}
            className="text-xl font-bold text-[#ff6b6b] dark:text-[#ff8080] whitespace-nowrap"
          >
            Prepify
          </Link>

          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 dark:bg-[#2a2a2a] border-none text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <span
              onClick={() => setTheme(colorTheme)}
              className="cursor-pointer p-2"
            >
              {colorTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </span>
            {userId ? (
              <Link to={"/Settings"}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600"></div>
              </Link>
            ) : (
              <Link
                to={"/auth"}
                className="text-sm font-medium text-[#ff6b6b] whitespace-nowrap"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Floating Action Button */}
      <Link
        to={"/createRecipe"}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-[#ff6b6b] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#ff5252] active:scale-95 transition-transform"
      >
        <span className="text-2xl font-light">+</span>
      </Link>
      <HeroSection />
      <div className="sticky top-20 z-30 bg-[#fafafa] dark:bg-[#1a1a1a] transition-colors duration-300 ">
        <FilterTab filterData={fData} />
      </div>
      <RecipesList recipes={recipes} />
    </div>
  );
}
