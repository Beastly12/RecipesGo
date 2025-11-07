import React, { useState } from "react";
import { PenLine, Trash2 } from "lucide-react";

const recipesData = [
  {
    id: 1,
    name: "Creamy Mushroom Pasta",
    category: "Italian",
    meal: "Dinner",
    time: "30 mins",
    status: "Public",
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
    status: "Public",
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
    status: "Public",
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
      <div className="flex flex-col sm:flex-row md:flex-col border-b-2">
        <div className="flex justify-between items-center p-8 sm:space-x-7">
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

      <ul className="space-y-1 ">
        {recipesData.map((recipe) => (
          <li
            key={recipe.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition shadow"
          >
            <div className="flex space-x-3 items-center">
              <img
                src={recipe.image}
                alt="Recipe Image"
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="space-y-1">
                <h2 className="font-semibold">{recipe.name}</h2>
                <p className="text- text-gray-500">
                  {recipe.category}•{recipe.meal}•{recipe.time}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-13">
              <span> {recipe.status}</span>

              <div className="space-x-3">
                <span>❤️{recipe.likes}</span> <span>💬 {recipe.comments}</span>
                <span className="text-gray-500">{recipe.date}</span>
              </div>
            </div>

            <div className="flex items-center space-x-5">
              <button className="cursor-pointer">
                <PenLine
                  size={23}
                  className="bg-[#ff6b6b] rounded-md text-white p-1"
                />
              </button>
              <button className="cursor-pointer">
                <Trash2
                  size={23}
                  className="bg-[#ff6b6b] rounded-md text-white p-1"
                />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {recipesData.length === 0 && (
        <p className="text-center text-gray-500 py-6 text-xl">
          No Recipe Found
        </p>
      )}
    </section>
  );
};

export default DashBoardManagementTable;
