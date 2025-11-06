import React, { useState } from "react";
import { Search } from "lucide-react";

const recipesData = [
  {
    id: 1,
    name: "Creamy Mushroom Pasta",
    category: "Italian",
    meal: "Dinner",
    time: "30 mins",
    status: "Published",
    date: "2 days ago",
    likes: 234,
    comments: 45,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  },
  {
    id: 2,
    name: "Chocolate Chip Cookies",
    category: "Dessert",
    meal: "Baking",
    time: "45 mins",
    status: "Published",
    date: "5 days ago",
    likes: 567,
    comments: 89,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  },
  {
    id: 3,
    name: "Homemade Pizza Dough",
    category: "Italian",
    meal: "Dinner",
    time: "2 hours",
    status: "Private",
    date: "1 week ago",
    likes: 89,
    comments: 12,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  },
  {
    id: 4,
    name: "Avocado Toast Variations",
    category: "Breakfast",
    meal: "Quick",
    time: "10 mins",
    status: "Published",
    date: "2 weeks ago",
    likes: 312,
    comments: 56,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  },
];

const DashBoardManagementTable = () => {
  const [searchRecipe, SetSearchRecipe] = useState("");
  const [recipe, setRecipe] = useState(recipesData);

  return (
    <section className=" bg-white rounded-3xl shadow mt-10">

      <div className="flex flex-col sm:flex-row md:flex-col ">
        <div className="flex justify-between items-center mb-7 p-5 sm:space-x-7">
          <h2 className="text-2xl font-bold ">My Recipes</h2>

          <div className="flex gap-5 items-center">
            <input
              type="text"
              placeholder="Search recipes..."
              className="outline-none text-sm text-gray-500 rounded-full w-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between p-5 text-gray-700 bg-gray-200">
        <h2>RECIPE</h2>
        <h2>STATUS</h2>
        <h2>ENGAGEMENT</h2>
        <h2>DATE</h2>
        <h2>ACTIONS</h2>
      </div>

      {}
    </section>
  );
};

export default DashBoardManagementTable;
