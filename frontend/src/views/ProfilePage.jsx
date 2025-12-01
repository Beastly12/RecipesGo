import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import RecipesList from '../components/RecipeList';
import { Link, useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getUserDetails } from '../services/UserService.mjs';
import { getFavoritesRecipes, getMyRecipes, getRecipesByUser } from '../services/RecipesService.mjs';
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

  const isOwner = loggedInUser?.userId && loggedInUser.userId=== profileUserId;

  useEffect(() => {
    if (!profileUserId) return;

    let on = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        let user;

        // If viewing own profile, use userDetails from context
        if (isOwner && userDetails) {
          user = userDetails;
        } else {
          // Otherwise, fetch the user details using the service
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
      author: activeTab === 'myRecipes' ? 'You' : r.authorName || 'Unknown',
      likes: r.likes ?? 0,
      profilePic: activeTab === 'myRecipes' ? avatarUrl : r.authorDp || '',
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
    <div className="min-h-100vh bg-[#fafafa] m-4 text-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-[#e5e5e5] dark:m-0">
      <Link to="/">
        <div className="flex m-4 p-3 space-x-3 dark:m-0">
          <ArrowLeft className="cursor-pointer" />
          <button className="text-xl font-medium hover:underline">Back</button>
        </div>
      </Link>

      <div className="max-w-[900px] mx-auto my-10 px-10">
        <div className="w-full rounded-2xl mb-6 flex bg-white dark:bg-[#1a1a1a] shadow-md">
          <div className="mt-8 mb-8 p-8 mr-6">
            <img
              className="rounded-full w-48 h-48 object-cover ring-2 ring-gray-200 dark:ring-white/10"
              src={avatarUrl}
              alt="Profile"
            />
          </div>

          <div className="m-6 md:space-y-10">
            <h3 className="font-bold text-5xl">{displayName}</h3>

            <p className="text-gray-700 dark:text-gray-300 mt-4">{bio}</p>

            <div className="flex items-center space-x-10 mt-8">
              <div>
                <p className="font-bold text-xl text-gray-600">{myRecipes.length}</p>
                <p className="text-xl">Recipes</p>
              </div>
              <div>
                <p className="font-bold text-xl text-gray-600">
                  {myRecipes.reduce((acc, r) => acc + (r.likes || 0), 0)}
                </p>
                <p className="text-xl">Total Likes</p>
              </div>
            </div>

            {isOwner && (
              <button className="flex items-center bg-[#ff6b6b] text-white rounded-xl p-3 mt-4">
                <Settings size={16} />
                <Link to={"/settings"} className="ml-2">Settings</Link>
              </button>
            )}
          </div>
        </div>

    
       
      </div>
      <div className='mx-auto max-w-[1000px] px-10'>
        {/* TABS */}
        <div className="flex space-x-20 border-b dark:border-white/10">
          <button
            onClick={() => setActiveTab('myRecipes')}
            className={`pb-2 text-xl ${
              activeTab === 'myRecipes'
                ? 'border-b-2 border-[#ff6b6b] text-[#ff6b6b]'
                : 'hover:border-b-gray-400 dark:hover:border-white/30'
            }`}
          >
            {isOwner ? 'My Recipes' : 'Recipes'}
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-2 text-xl ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-[#ff6b6b] text-[#ff6b6b]'
                  : 'hover:border-b-gray-400 dark:hover:border-white/30'
              }`}
            >
              Favorites
            </button>
          )}
        </div>

       <div className="m-10 mt-20">
          {listForUI.length === 0 ? (
            <p className="text-center text-gray-500">
              No {activeTab === 'myRecipes' ? 'recipes' : 'favorites'} yet.
            </p>
          ) : (
            <>
              <RecipesList recipes={listForUI} />

              {hasMore && (
                <button
                  disabled={loadingMore}
                  onClick={loadMore}
                  className="mt-6 bg-gray-200 dark:bg-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              )}
            </>
          )}
       </div>

      </div>
          
    </div>
  );
}