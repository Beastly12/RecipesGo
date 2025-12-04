import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Utensils,
  ChartNoAxesColumn,
  Star,
  Heart,
} from 'lucide-react';
import { Accordion } from '../components/Accordion';
import InstructionBox from '../components/InstructionBox';
import IngredientsBox from '../components/IngredientsBox';
import CommentBox from '../components/ComponentBox';
import {
  favoriteRecipe,
  getAllRatings,
  getRecipebyId,
  rateRecipe,
  deleteFavoriteRecipe,
  deleteRatingRecipe,
} from '../services/RecipesDetailsService.mjs';
import { message } from 'antd';
import { useAuthContext } from '../context/AuthContext';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState([]);
  const [visibleComment, setVisibleComment] = useState(2);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [hasMore, setMore] = useState(false);
  const [lastKey, setLastkey] = useState('');
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user: loggedInUser, loading: authLoading } = useAuthContext();

  useEffect(() => {
    async function fetchRecipe() {
      try {
        await handleDetails(id);
      } catch (error) {
        console.log('failed to fetch recipe', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, []);

  const handleViewMore = () => {
    setVisibleComment((prev) => prev + 2);
  };

  const handleRatings = async (id) => {
    setLoading(true);
    try {
      const { data } = await getAllRatings({ recipeId: id });

      const ratingsData = data.message.map((rating) => ({
        key: rating.RecipeId,
        stars: rating.stars,
        text: rating.comment,
        profilePic: rating.dpUrl,
        name: rating.name,
        posted: rating.dateAdded,
        authorId: rating.userId,
      }));
      console.log(ratingsData);

      setRatings(ratingsData);
      setMore(Boolean(data.last));
      setLastkey(data.last);
    } catch (error) {
      console.error('Failed to fetch ratings for recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRatings(id);
  }, []);

  const handleDetails = async (id) => {
    setLoading(true);
    try {
      const { data } = await getRecipebyId({ recipeId: id });

      const detail = data.message;
      const recipeData = {
        key: detail.id,
        Name: detail.name,
        Image: detail.imageUrl,
        Description: detail.description,
        Category: detail.category,
        Ingredients: detail.ingredients,
        Instructions: detail.instructions,
        Time: detail.preparationTime,
        Published: detail.isPublic,
        Difficulty: detail.difficulty,
        AuthorID: detail.authorId,
        AuthorName: detail.authorName,
        Likes: detail.likes,
        isFavorited: detail.isFavorite,
      };
      setLiked(recipeData.isFavorited);
      console.log('Recipe Details:', recipeData);
      setRecipe(recipeData);
      setMore(Boolean(data.last));
      setLastkey(data.last);
      setLikes(recipeData.Likes);
    } catch (error) {
      console.error('Failed to fetch details for recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!starRating === 0) {
      message.error('Please enter a comment and select a star rating.');
      return;
    }

    try {
      await rateRecipe(id, starRating, newComment);

      message.success('Comment added successfully!');
      handleRatings(id, lastKey);

      setNewComment('');
      setStarRating(0);
      // setPopupOpen(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
      message.error('An error occurred while adding your comment.');
    }
  };

  const handleLike = async () => {
    try {
      if (!liked) {
        await favoriteRecipe(id);
        setLikes((prev) => prev + 1);
        setLiked(true);
        message.success('Recipe liked!');
      } else {
        await deleteFavoriteRecipe(id);
        setLikes((prev) => prev - 1);
        setLiked(false);
        message.success('Recipe unliked!');
      }
    } catch (error) {
      console.error('Error LIKING RECIPE:', error);
      message.error('An error occurred while liking the recipe.');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    console.log('Current URL:', url);
    message.success('Link copied to clipboard!');
  };

  const handleDeleteComment = async () => {
    setIsDeleting(true);
    try {
      await deleteRatingRecipe(id);
      message.success('Comment deleted successfully!');
      handleRatings(id, lastKey);
    } catch (error) {
      message.error('An error occurred while deleting the comment.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <p className="text-center mt-10 dark:text-[#e5e5e5]">Loading recipe....</p>;
  if (!recipe) return <p className="text-center mt-10 dark:text-[#e5e5e5]">Recipe not found.</p>;

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans dark:bg-[#0a0a0a] dark:text-[#e5e5e5]">
      {contextHolder}
      
      {/* Back Button */}
      <div className="lg:max-w-[900px] lg:mx-auto px-5 lg:px-10 pt-10">
        <Link
          to={'/'}
          className="inline-flex items-center gap-2 text-xl text-[#1a1a1a] hover:underline dark:text-[#e5e5e5] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
      </div>

      <div className="lg:max-w-[900px] py-10 lg:mx-auto px-5 lg:px-10">
        {/* Recipe Image */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow dark:shadow-lg dark:shadow-black/50 overflow-hidden mb-6">
          <img
            className="w-full h-96 object-cover"
            src={recipe.Image}
            alt="Recipe Image"
          />
        </div>

        {/* Recipe Title */}
        <h1 className="text-4xl lg:text-5xl font-semibold mb-6 dark:text-white">
          {recipe.Name}
        </h1>

        {/* Author Info and Actions */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow dark:shadow-lg dark:shadow-black/50 p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <Link to={`/profile/${recipe.AuthorID}`}>
                <p className="font-bold text-xl text-gray-800 dark:text-white cursor-pointer hover:text-[#ff6b6b] dark:hover:text-[#ff8080] transition-colors">
                  {recipe.AuthorName}
                </p>
              </Link>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                {recipe.Published}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Likes Button */}
              {loggedInUser?.userId && (
                <button
                  className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300
                    ${liked 
                      ? 'bg-[#ff6b6b] text-white dark:bg-[#ff6b6b]/70 hover:bg-[#ff5252] dark:hover:bg-[#ff6b6b]/80' 
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  onClick={handleLike}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>Likes ({likes})</span>
                </button>
              )}

              {/* Share Button */}
              <button
                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                onClick={handleShare}
              >
                <ExternalLink className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow dark:shadow-lg dark:shadow-black/50 p-6 lg:p-8 mb-6">
          <Accordion sections={[{ id: 1, text: recipe.Description }]} />
        </div>

        {/* Recipe Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-[#1a1a1a] shadow dark:shadow-lg dark:shadow-black/50 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="bg-[#ff6b6b] dark:bg-[#ff6b6b]/30 p-3 rounded-xl mb-3">
              <Clock className="w-6 h-6 text-white dark:text-[#ff8080]" />
            </div>
            <p className="font-semibold text-gray-800 dark:text-white">{recipe.Time}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Prep Time</p>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] shadow dark:shadow-lg dark:shadow-black/50 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="bg-[#ff6b6b] dark:bg-[#ff6b6b]/30 p-3 rounded-xl mb-3">
              <Utensils className="w-6 h-6 text-white dark:text-[#ff8080]" />
            </div>
            <p className="font-semibold text-gray-800 dark:text-white">{recipe.Category}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Category</p>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] shadow dark:shadow-lg dark:shadow-black/50 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="bg-[#ff6b6b] dark:bg-[#ff6b6b]/30 p-3 rounded-xl mb-3">
              <ChartNoAxesColumn className="w-6 h-6 text-white dark:text-[#ff8080]" />
            </div>
            <p className="font-semibold text-gray-800 dark:text-white">{recipe.Difficulty}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Difficulty</p>
          </div>
        </div>

        {/* Ingredients and Instructions Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Ingredients */}
            <IngredientsBox ingredients={recipe.Ingredients} />
          

          {/* Instructions */}
            <InstructionBox instructions={recipe.Instructions} />
        </div>

        {/* Comments Section */}
          <CommentBox
            totalComments={ratings}
            visibleComments={visibleComment}
            hasMore={hasMore}
            handleViewMore={handleViewMore}
            comment={newComment}
            setComment={setNewComment}
            starRating={starRating}
            setStarRating={setStarRating}
            handleComment={handleComment}
            handleRatings={handleRatings}
            recipeId={id}
            lastKey={lastKey}
            handleDelete={handleDeleteComment}
            isDeleting={isDeleting}
          />
      </div>
    </div>
  );
}

export default RecipeDetailPage;