import { Link } from 'react-router-dom';
import RecipeCardSkeleton from './RecipeCardSkeleton';

const RecipesList = ({ recipes, hasmore, handlePagination, loading }) => {
  if (loading) {
    return (
      <div className="px-10 mt-2 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </div>
    );
  }

  return (
    <>
      {recipes.length > 0 ? (
        <>
          <div className="px-10 mt-2 min-h-[50vh] pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Link to={`/recipe-details/${recipe.key}`} key={recipe.key}>
                <div className="mb-6 bg-white dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50 rounded-2xl overflow-hidden shadow hover:shadow-xl transition-transform duration-300 ease-out hover:-translate-y-1 cursor-pointer">
                  <div className="overflow-hidden">
                    <div
                      className="w-full aspect-4/3 bg-cover bg-center transition-transform duration-300 ease-out hover:scale-105 will-change-transform"
                      style={{
                        backgroundImage: `url(${recipe.img})`,
                        transform: 'translateZ(0)',
                      }}
                    ></div>
                  </div>

                  <div className="p-4">
                    <div className="text-lg font-semibold mb-2 dark:text-gray-600">
                      {recipe.title}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {recipe.authorDpUrl ? (
                          <img
                            className="w-7 h-7 rounded-full"
                            src={recipe.authorDpUrl}
                            alt="authordp"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-linear-to-br from-pink-300 to-red-400"></div>
                        )}
                        <span className="text-sm text-gray-600 font-medium">{recipe.author}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span className="text-[#ff6b6b]">♥</span>
                        <span>{recipe.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasmore && (
            <div className="flex items-center justify-center py-6">
              <button
                onClick={handlePagination}
                className="bg-[#ff6b6b] text-white hover:bg-[#ff5252] hover:shadow-[#ff5252] px-14 py-2 rounded-full font-semibold transition-transform duration-300 ease-out hover:-translate-y-0.5 shadow hover:shadow-lg"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="dark:text-white flex items-center justify-center text-black h-[50vh]  text-2xl md:text-4xl w-full">
          No Recipes, Try a different Filter or better still create one 😊
        </div>
      )}
    </>
  );
};

export default RecipesList;
