import React, { useEffect, useState } from 'react';
import { Globe, Lock, PenLine, Trash2 } from 'lucide-react';
import { getRecipesByUser, deleteRecipe, editRecipe } from '../services/RecipesService.mjs';

const DashBoardManagementTable = ({ userId, onRecipeCountChange }) => {
  const [searchRecipe, SetSearchRecipe] = useState('');
  const [recipe, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.warn('No userId provided to DashBoardManagementTable');
      setLoading(false);
      return;
    }

    async function fetchRecipes() {
      setLoading(true);
      try {
        const res = await getRecipesByUser(userId);
        console.log('Recipes API response:', res);
        const list = res.data?.message || [];
        setRecipes(list);

        onRecipeCountChange?.(list.length);
      } catch (error) {
        console.error('Error fetching recipes', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [userId]);

  const handleDelete = async (recipeId) => {
    try {
      await deleteRecipe(recipeId);
      const updated = recipe.filter((r) => r.id !== recipeId);
      setRecipes(updated);

      onRecipeCountChange(updated.length);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const filteredRecipes = recipe.filter((r) =>
    r.name.toLowerCase().includes(searchRecipe.toLowerCase())
  );

  const statusTheme = (isPublic) => {
    return (
      <span
        className={`p-1 inline-flex ... rounded ${isPublic ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}
      >
        {isPublic ? <Globe size={14} /> : <Lock size={14} />}
        {isPublic ? 'Public' : 'Private'}
      </span>
    );
  };

  const timeAgo = (dateString) => {
    if (!dateString) return '';

    // Fix backend format: "2025-11-19 16:19:23"
    const date = new Date(dateString.replace(' ', 'T'));
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let unit in intervals) {
      const amount = Math.floor(seconds / intervals[unit]);
      if (amount >= 1) {
        return amount + ' ' + unit + (amount > 1 ? 's' : '') + ' ago';
      }
    }

    return 'Just now';
  };

  return (
    <section className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-500 rounded-3xl shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] mt-10 transition-all duration-300">
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

      <ul className="divide-y divide-gray-200 dark:divide-white">
        {filteredRecipes.map((recipe) => (
          <li
            key={recipe.id}
            className="flex items-center justify-between p-5 hover:bg-gray-50 transition shadow dark:hover:bg-slate-500/35"
          >
            <div className="flex space-x-3 items-center">
              <img
                src={recipe.imageUrl}
                alt="Recipe Image"
                className="w-28 h-28 object-cover rounded-xl shadow"
              />
              <div className="sm:flex-row justify-between items-center">
                <h2 className="font-semibold text-gray-500 dark:text-white">{recipe.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {recipe.category}•{recipe.difficulty}•{recipe.preparationTime}mins
                </p>
              </div>
            </div>

            <div className="flex items-center sm:flex-row md:flex-row mr-2 sm:ml-8 gap-4">
              <span> {statusTheme(recipe.isPublic)}</span>

              <div className="flex sm:flex-col md:flex-row gap-4 text-sm dark:text-gray-200 text-gray-700">
                <span>❤️{recipe.likes}</span> <span>💬 {recipe.rating}</span>
                <span className="text-gray-500 dark:text-gray-300">
                  {timeAgo(recipe.dateCreated)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="cursor-pointer hover:scale-110 transition-transform">
                <PenLine size={23} className="bg-[#ff6b6b] rounded-md text-white p-1" />
              </button>
              <button
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleDelete(recipe.id)}
              >
                <Trash2 size={23} className="bg-[#ff6b6b] rounded-md text-white p-1" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filteredRecipes.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-6 text-2xl dark:text-white">No Recipe Found</p>
      )}
    </section>
  );
};

export default DashBoardManagementTable;
