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
import { favoriteRecipe, getAllRatings, getRecipebyId, favoriteCheck, rateRecipe, deleteFavoriteRecipe} from '../services/RecipesDetailsService.mjs';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState([]);
  const [visibleComment, setVisibleComment] = useState(2);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [hasMore, setMore] = useState(false);
  const [lastKey, setLastkey] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [liked, setLiked] = useState(false);
  
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

  const handlePopupOpen = () => {
    setPopupOpen(true);
  }

  const handlePopupClosed = () => {
    setPopupOpen(false);
  }

  const handleRatings = async (id) => {
    setLoading(true);
    try {
      const { data } = await getAllRatings({ recipeId: id});

      const ratingsData = data.message.map((rating) => ({
        key: rating.userId,
        stars: rating.stars,
        text: rating.comment,
        profilePic:rating.dpUrl,
        name:rating.name,
        posted:rating.dateAdded
      }));
      console.log(ratingsData)

      setRatings(ratingsData);
      setMore(Boolean(data.last));
      setLastkey(data.last);
      console.log("Backend rating data:", data.message);

    } catch (error) {
      console.error('Failed to fetch ratings for recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    handleRatings(id)

  },[]);

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
        Likes: detail.likes
      };

      setRecipe(recipeData);
      setMore(Boolean(data.last));
      setLastkey(data.last);
      setLikes(recipeData.Likes)
      console.log("Backend data:", data.message);
    } catch (error) {
      console.error('Failed to fetch details for recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!starRating === 0) {
      alert('Please enter a comment and select a star rating.');
      return;
    }
  
    try {
      await rateRecipe(id, starRating, newComment);

      alert('Comment added successfully!');
      handleRatings(id, lastKey); 
  
      setNewComment('');
      setStarRating(0);
      setPopupOpen(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment');
    }
  };

  const handleLike = async () => {
    try {
      if (!liked) {
        await favoriteRecipe(id);
        setLikes(prev => prev + 1);
        setLiked(true);
        alert('LIKED SUCCESSFULLY');
      } else {
        await deleteFavoriteRecipe(id);
        setLikes(prev => prev - 1);
        setLiked(false);
        alert('UNLIKED SUCCESSFULLY');
      }
    } catch (error) {
      console.error('Error LIKING RECIPE:', error);
      alert('FAILED TO LIKE');
    }
  };

  useEffect(() => {
    async function LikeStatus() {
      try {
        const likedStatus = await favoriteCheck(id);
        setLiked(likedStatus);
      } catch (error) {
        console.error('Failed to fetch liked status:', error);
      }
    }
  
    LikeStatus();
  }, [id]);
  
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    console.log("Current URL:", url);
    alert('Link copied to clipboard!');
  };
  

  if (loading) return <p className="text-center mt-10">Loading recipe....</p>;
  if (!recipe) return <p className="text-center mt-10">Recipe not found.</p>;

  // const visibleComments = recipe.comments.slice(0, visibleComment);
  // const hasMore = visibleComment < recipe.comments.length;

  return (
    <div className="bg-[#fafafa] min-h-screen m-4 text-[#1a1a1a]  dark:bg-[#0a0e27] dark:text-[#fafafa] dark:m-0">
      <div className=" flex flex-col justify-items-center">
        {/* Back Button */}
        <Link
          to={'/'}
          className="flex items-center space-x-5 text-[#1a1a1a] p-2 hover:underline mb-4 dark:text-white ml-5 "
        >
          <ArrowLeft /> <span className="text-2xl p-3">Back</span>
        </Link>
      </div>

      <div className="max-w-[900px] my-[40px] mx-[auto] px-[40px] dark:text-[#fafafa]">
        <div className=" flex flex-col justify-items-center">
          <div>
            {/* Image Card */}
            <div className="rounded-4xl w-full mt-8 mb-8 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
              <img
                className="w-full h-96 object-cover rounded-3xl"
                src={recipe.Image}
                alt="Recipe Image"
              />
            </div>
            {/* User Info Card */}
            <h1 className="text-5xl font-semibold mb-5 mt-8 dark:text-white ">{recipe.Name}</h1>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-2 text-sm text-gray-500 mb-4 mt-6 p-7 shadow-[0_12px_24px_rgba(0,0,0,0.12)] rounded-2xl  dark:bg-[#fafafa] ">
              <div className="grid grid-cols-1 gap-3 sm:grid-rows-1 ">
                <Link to={`/profile/${recipe.AuthorID}`}>
                  <p className="font-bold text-xl text-gray-800 px-4 cursor-pointer dark:text-gray-600">
                    {recipe.AuthorName}
                  </p>
                </Link>

                <p className="text-sm text-gray-500 mb-2 px-4 dark:text-gray-400">
                  {recipe.Published}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 dark:text-[#fafafa]">
                {/* Likes Button */}
                <button className={`cursor-pointer flex items-center justify-center gap-2 py-2 px-4 sm:px-6 rounded-3xl text-sm transition-all duration-300 w-full dark:text-[#fafafa]
                                   ${liked ? "bg-[#ff6b6b] text-white hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)]" : "bg-white text-[#ff6b6b] border border-[#ff6b6b] hover:shadow-md"}`}
                         onClick={handleLike}
                >
                  <Heart className="w-5 h-5" />
                  <span>Likes ({likes})</span>
                </button>
                

                {/* Share Button */}
                <button
                  className=" cursor-pointer flex items-center justify-center gap-2 bg-gray-100 text-gray-600 border py-2 px-4 sm:px-6 rounded-3xl text-sm
                 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 w-full dark:bg-[#2a2a2a] dark:text-gray-300 "
                 onClick={handleShare}
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <Accordion sections={[{ id: 1, text: recipe.Description }]} />

            <div className="grid md:grid-cols-2 gap-10 mt-10">
              <div>
                {/* Cards: Time / Category / Difficulty */}
                <div className="grid sm:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col items-center bg-gray-50 dark:bg-[#1a1a1a] shadow-md rounded-2xl p-6">
                    <Clock className="bg-[#ff6b6b] text-white rounded-2xl p-1" />
                    <p className="font-semibold mt-2">{recipe.Time}</p>
                  </div>
                  <div className="flex flex-col items-center bg-gray-50 dark:bg-[#1a1a1a] shadow-md rounded-2xl p-6">
                    <Utensils className="bg-[#ff6b6b] text-white rounded-2xl p-1" />
                    <p className="font-semibold mt-2">{recipe.Category}</p>
                  </div>
                  <div className="flex flex-col items-center bg-gray-50 dark:bg-[#1a1a1a] shadow-md rounded-2xl p-6">
                    <ChartNoAxesColumn className="bg-[#ff6b6b] text-white rounded-2xl p-1" />
                    <p className="font-semibold mt-2">{recipe.Difficulty}</p>
                  </div>
                </div>

                {/* Ingredients */}
                <IngredientsBox ingredients={recipe.Ingredients} />
              </div>

              {/* Instructions */}
              <InstructionBox instructions={recipe.Instructions} />
            </div>

            <CommentBox
              totalComments={ratings}
              visibleComments={visibleComment}
              hasMore={hasMore}
              handleViewMore={handleViewMore}
              handlePopupOpen = {handlePopupOpen}// po upo
              handlePopupClosed = {handlePopupClosed}
              isPopupOpen={isPopupOpen}
              comment={newComment}
              setComment={setNewComment}// pop up
              starRating={starRating}//pop up
              setStarRating={setStarRating}// pop up
              handleComment={handleComment}// pop up 
              handleRatings = {handleRatings}
              recipeId={id}
              lastKey={lastKey}
            /> 
             
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;

                        
