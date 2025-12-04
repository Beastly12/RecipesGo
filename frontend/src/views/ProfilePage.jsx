import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import RecipesList from '../components/RecipeList';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getUserDetails } from '../services/UserService.mjs';
import {
  getFavoritesRecipes,
  getMyRecipes,
  getRecipesByUser,
} from '../services/RecipesService.mjs';
import axios from '../services/Axios.mjs';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('myRecipes');

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://randomuser.me/api/portraits/lego/6.jpg');

  const [myRecipes, setMyRecipes] = useState([]);
  const [myCursor, setMyCursor] = useState(null);

  const [favs, setFavs] = useState([]);
  const [favCursor, setFavCursor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [userId, setUserId] = useState(null);

  const { id: profileUserIdRaw } = useParams();
  const { user: loggedInUser, userDetails } = useAuthContext();
  const profileUserId = profileUserIdRaw ? profileUserIdRaw : '';

  const isOwner = loggedInUser?.userId && loggedInUser.userId === profileUserId;
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileUserId) return;

    let on = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        let user;

        if (isOwner && userDetails) {
          user = userDetails;
        } else {
          const userRes = await getUserDetails(profileUserId);
          user = userRes;
        }

        if (!user) throw new Error('User not found.');
        // console.log(user);

        setDisplayName(user.name ?? '');
        setBio(user.bio ?? '');
        setLocation(user.location ?? '');
        setAvatarUrl(
          user.dpUrl && user.dpUrl.length > 0
            ? user.dpUrl
            : 'https://randomuser.me/api/portraits/lego/6.jpg'
        );
        setUserId(user.userid);

        // Fetch user's recipes - PASS THE USER ID
        const recipesPage = await getRecipesByUser(user.userid);
        console.log(recipesPage);

        if (!on) return;

        const allRecipes = recipesPage.data.message ?? [];
        setMyRecipes(allRecipes);
        setMyCursor(recipesPage.data.last ?? null);

        // Fetch user's favorites (only if owner)
        if (isOwner) {
          const favsPage = await getFavoritesRecipes();
          if (on) {
            setFavs(favsPage.data.message ?? []);
            setFavCursor(favsPage.data.last ?? null);
          }
        }
      } catch (e) {
        const msg = e.response?.data?.message || e.message || 'An unexpected error occurred.';
        if (on) setError(msg);
      } finally {
        if (on) setLoading(false);
      }
    })();

    return () => {
      on = false;
    };
  }, [profileUserId, isOwner, userDetails]);

  // -----------------------------------------
  // Pagination (Load More)
  // -----------------------------------------
  async function loadMore() {
    const usingMy = activeTab === 'myRecipes';
    const cursor = usingMy ? myCursor : favCursor;
    if (!cursor) return;

    setLoadingMore(true);
    try {
      if (usingMy) {
        // Use the service function with userId and cursor
        const page = await getMyRecipes(userId, cursor);
        const items = page.data.message ?? [];
        const last = page.data.last ?? null;

        setMyRecipes((prev) => [...prev, ...items]);
        setMyCursor(last);
      } else {
        // For favorites, use the favorites endpoint
        const page = await axios.get('/favorites', {
          params: { last: cursor },
        });
        const items = page.data.message ?? [];
        const last = page.data.last ?? null;

        setFavs((prev) => [...prev, ...items]);
        setFavCursor(last);
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Could not load more items.');
    } finally {
      setLoadingMore(false);
    }
  }

  const listForUI = useMemo(() => {
    const src = activeTab === 'myRecipes' ? myRecipes : favs;

    return src.map((r, idx) => ({
      key: r.id ?? idx,
      title: r.name,
      author: r.authorName === userDetails.name ? 'You' : r.authorName,
      likes: r.likes ?? 0,
      authorDpUrl: activeTab === 'myRecipes' ? avatarUrl : r.authorDp || '',
      img: r.imageUrl ?? '',
    }));
  }, [activeTab, myRecipes, favs, avatarUrl]);

  const hasMore = activeTab === 'myRecipes' ? !!myCursor : !!favCursor;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] m-4 text-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-[#e5e5e5] p-4 md:p-0">
      <button onClick={() => navigate(-1)}>
        <div className="flex items-center space-x-3 mb-4 md:ml-6 mt-2">
          <ArrowLeft className="cursor-pointer" />
          <button className="text-lg md:text-xl font-medium hover:underline">Back</button>
        </div>
      </button>

      <div className="max-w-[900px] mx-auto my-6 md:my-10 px-4 md:px-10">
        <div className="w-full rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-md flex flex-col md:flex-row items-center md:items-start p-6 md:p-10 space-y-6 md:space-y-0">
          <div className="flex justify-center md:mr-10">
            <img
              className="rounded-full w-32 h-32 md:w-48 md:h-48 object-cover ring-2 ring-gray-200 dark:ring-white/10"
              src={avatarUrl}
              alt="Profile"
            />
          </div>

          <div className="flex-1 space-y-4 md:space-y-8 text-center md:text-left">
            <h3 className="font-bold text-3xl md:text-5xl break-words">{displayName}</h3>

            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base px-2 md:px-0">
              {bio}
            </p>

            <div className="flex justify-center md:justify-start space-x-10 mt-6 md:mt-8">
              <div>
                <p className="font-bold text-lg md:text-xl text-gray-600">{myRecipes.length}</p>
                <p className="text-base md:text-xl">Recipes</p>
              </div>
              <div>
                <p className="font-bold text-lg md:text-xl text-gray-600">
                  {myRecipes.reduce((acc, r) => acc + (r.likes || 0), 0)}
                </p>
                <p className="text-base md:text-xl">Total Likes</p>
              </div>
            </div>

            {isOwner && (
              <Link to="/settings" className="flex justify-center md:justify-start">
                <button className="flex items-center bg-[#ff6b6b] text-white rounded-xl p-2 md:p-3 text-sm md:text-base">
                  <Settings size={16} />
                  <span className="ml-2">Settings</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1000px] px-4 md:px-10">
        {/* TABS */}
        <div className="flex overflow-x-auto space-x-10 border-b dark:border-white/10 pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('myRecipes')}
            className={`pb-2 text-lg md:text-xl whitespace-nowrap ${
              activeTab === 'myRecipes'
                ? 'border-b-2 border-[#ff6b6b] text-[#ff6b6b]'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {isOwner ? 'My Recipes' : 'Recipes'}
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-2 text-lg md:text-xl whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-[#ff6b6b] text-[#ff6b6b]'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Favorites
            </button>
          )}
        </div>

        <div className="mt-10 md:mt-20 px-2 md:px-0">
          {listForUI.length === 0 ? (
            <p className="text-center text-gray-500 text-sm md:text-base">
              No {activeTab === 'myRecipes' ? 'recipes' : 'favorites'} yet.
            </p>
          ) : (
            <>
              <RecipesList
                recipes={listForUI}
                hasmore={hasMore}
                handlePagination={loadMore}
                loading={loadingMore}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
