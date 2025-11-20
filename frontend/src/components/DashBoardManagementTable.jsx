import React, { useEffect, useState } from 'react';
import { Globe, Lock, PenLine, Trash2 } from 'lucide-react';
import { getRecipesByUser, deleteRecipe } from '../services/RecipesService.mjs';
import { useNavigate } from 'react-router-dom';

const DashBoardManagementTable = ({ userId, onRecipeCountChange, loading: dashboardLoading }) => {
  const [searchRecipe, SetSearchRecipe] = useState('');
  const [recipe, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [editLoadingId, setEditLoadingId] = useState(null);
  const [visible, setVisible] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchRecipes() {
      setLoading(true);
      try {
        const res = await getRecipesByUser(userId);
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
    setDeleteLoadingId(recipeId);
    try {
      await deleteRecipe(recipeId);
      const updated = recipe.filter((r) => r.id !== recipeId);
      setRecipes(updated);
      onRecipeCountChange(updated.length);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const filteredRecipes = recipe.filter((r) =>
    r.name.toLowerCase().includes(searchRecipe.toLowerCase())
  );

  const statusTheme = (isPublic) => (
    <span
      className={`p-1 inline-flex rounded ${
        isPublic ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
      }`}
    >
      {isPublic ? <Globe size={14} /> : <Lock size={14} />}
      {isPublic ? 'Public' : 'Private'}
    </span>
  );

  const timeAgo = (dateString) => {
    if (!dateString) return '';
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
      if (amount >= 1) return amount + ' ' + unit + (amount > 1 ? 's' : '') + ' ago';
    }
    return 'Just now';
  };

  const handleEdit = (recipeId) => {
    setEditLoadingId(recipeId);
    setTimeout(() => {
      navigate(`/createRecipe${recipeId}`);
    });
  };

  // Skeleton row
  const SkeletonRow = () => (
    <li className="flex items-center justify-between p-5 animate-pulse">
      <div className="flex space-x-3 items-center">
        <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-xl shadow"></div>
        <div className="flex flex-col justify-between">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="flex space-x-4">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </li>
  );

  // Show skeleton if dashboard is loading or table is loading
  if (dashboardLoading || loading) {
    return (
      <section className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-500 rounded-3xl shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] mt-10 transition-all duration-300">
        <div className="flex flex-col sm:flex-row md:flex-col shadow-none dark:shadow-none">
          <div className="flex justify-between items-center p-8 sm:space-x-9">
            <h2 className="text-2xl font-bold mb-3 md:mb-0 text-gray-800 dark:text-white">
              My Recipes
            </h2>
            <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-white">
          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </ul>
      </section>
    );
  }

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
              onChange={(e) => SetSearchRecipe(e.target.value)}
            />
          </div>
        </div>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-white">
        {filteredRecipes.slice(0, visible).map((recipe) => (
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
              <button
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleEdit(recipe.id)}
              >
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

      {visible < filteredRecipes.length && (
        <div className="text-center py-6">
          <button
            onClick={() => setVisible((v) => v + 2)}
            className="px-6 py-2 bg-[#ff6b6b] text-white rounded-full hover:opacity-90 transition"
          >
            Load More
          </button>
        </div>
      )}

      {filteredRecipes.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-6 text-2xl dark:text-white">No Recipe Found</p>
      )}
    </section>
  );
};

export default DashBoardManagementTable;
