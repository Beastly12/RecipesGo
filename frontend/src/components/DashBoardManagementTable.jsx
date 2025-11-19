import React, { useState } from 'react';
import { Globe, Lock, PenLine, Trash2 } from 'lucide-react';

const recipesData = [
  {
    id: 1,
    name: 'Creamy Mushroom Pasta',
    category: 'Italian',
    meal: 'Dinner',
    time: '30 mins',
    status: 'Public',
    date: '2 days ago',
    likes: 234,
    comments: 45,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  },
  {
    id: 2,
    name: 'Chocolate Chip Cookies',
    category: 'Dessert',
    meal: 'Baking',
    time: '45 mins',
    status: 'Public',
    date: '5 days ago',
    likes: 567,
    comments: 89,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  },
  {
    id: 3,
    name: 'Homemade Pizza Dough',
    category: 'Italian',
    meal: 'Dinner',
    time: '2 hours',
    status: 'Private',
    date: '1 week ago',
    likes: 89,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  },
  {
    id: 4,
    name: 'Avocado Toast Variations',
    category: 'Breakfast',
    meal: 'Quick',
    time: '10 mins',
    status: 'Public',
    date: '2 weeks ago',
    likes: 312,
    comments: 56,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  },
];

const DashBoardManagementTable = () => {
  const [searchRecipe, SetSearchRecipe] = useState('');
  const [recipe, setRecipe] = useState(recipesData);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecipes = recipe.filter((r) =>
    r.name.toLowerCase().includes(searchRecipe.toLowerCase())
  );

  const statusTheme = (status) => {
    const isPublished = status === 'Public';
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isPublished ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
        }`}
      >
        {isPublished ? <Globe size={16} className="p-1" /> : <Lock size={16} className="p-1" />}
        {isPublished ? 'Public' : 'Private'}
      </span>
    );
  };

  return (
    <section className="bg-white dark:bg-[#1a1a1a] border-gray-500 border rounded-3xl shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] mt-10 transition-all duration-300">
      <div className="flex flex-col sm:flex-row md:flex-col shadow-none dark:shadow-none">
        <div className="flex justify-between items-center p-8 sm:space-x-9">
          <h2 className="text-2xl font-bold mb-3 md:mb-0 text-gray-800 dark:text-white">
            My Recipes
          </h2>

          <div className="w-full">
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full text-sm rounded-full px-4 py-2 border-gray-600 border bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
              value={searchRecipe}
              onChange={(e) => {
                SetSearchRecipe(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      {/* <div className=" hidden md:grid grid-cols-5 gap-4 px-6 py-3 justify-between text-gray-700 bg-gray-200 font-semibold">
        <h2>RECIPE</h2>
        <h2>STATUS</h2>
        <h2>ENGAGEMENT</h2>
        <h2>DATE</h2>
        <h2>ACTIONS</h2>
      </div> */}

      <ul className="divide-y divide-gray-200 dark:divide-white">
        {filteredRecipes.map((recipe) => (
          <li
            key={recipe.id}
            className="flex items-center justify-between p-5 hover:bg-gray-50 transition shadow dark:hover:bg-slate-500/35"
          >
            <div className="flex space-x-3 items-center">
              <img
                src={recipe.image}
                alt="Recipe Image"
                className="w-28 h-28 object-cover rounded-xl shadow"
              />
              <div className="sm:flex-row justify-between items-center">
                <h2 className="font-semibold text-gray-500 dark:text-white">{recipe.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {recipe.category}•{recipe.meal}•{recipe.time}
                </p>
              </div>
            </div>

            <div className="flex items-center sm:flex-row md:flex-row mr-2 sm:ml-8 gap-4">
              <span> {statusTheme(recipe.status)}</span>

              <div className="flex sm:flex-col md:flex-row gap-4 text-sm dark:text-gray-200 text-gray-700">
                <span>❤️{recipe.likes}</span> <span>💬 {recipe.comments}</span>
                <span className="text-gray-500 dark:text-gray-300">{recipe.date}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="cursor-pointer hover:scale-110 transition-transform">
                <PenLine size={23} className="bg-[#ff6b6b] rounded-md text-white p-1" />
              </button>
              <button className="cursor-pointer hover:scale-110 transition-transform">
                <Trash2 size={23} className="bg-[#ff6b6b] rounded-md text-white p-1" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filteredRecipes.length === 0 && (
        <p className="text-center text-gray-500 py-6 text-2xl dark:text-white">No Recipe Found</p>
      )}
    </section>
  );
};

export default DashBoardManagementTable;
