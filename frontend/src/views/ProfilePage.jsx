import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import RecipesList from "../components/RecipeList";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { getUserDetails } from "../services/UserService.mjs";
import axios from "axios";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("myRecipes");

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://randomuser.me/api/portraits/lego/6.jpg"
  );

const [myRecipes, setMyRecipes] = useState([]);
const [myCursor, setMyCursor] = useState(undefined);
const [favs, setFavs] = useState([]);
const [favCursor, setFavCursor] = useState(undefined);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [userId, setUserId] = useState(null);

  const { id: profileUserIdRaw } = useParams();
  const { user: loggedInUser, userDetails } = useAuthContext();
  const profileUserId = profileUserIdRaw ? String(profileUserIdRaw) : "";

const isOwner = String(loggedInUser?.userId) === profileUserId;






useEffect(() => {
  if((!profileUserId || profileUserId.trim() === "") && loggedInUser?.userId){
    navigate(`/profile/${loggedInUser.userId}`);
  }
}, [profileUserId,loggedInUser, navigate])
useEffect(() =>{
if (!profileUserId) return;
  let on = true;
  (async () => {
    try{
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

        if (!user) throw new Error("User not found.");

        setDisplayName(user.name ?? "");
        setBio(user.bio ?? "");
        setLocation(user.location ?? "");
        setAvatarUrl(
          user.dpUrl && user.dpUrl.length > 0
            ? user.dpUrl
            : "https://randomuser.me/api/portraits/lego/6.jpg"
        );
        setUserId(String(user.userid));

        // Fetch user's recipes
        const recipesPage = await axios.get("/recipes", {
          params: { by: profileUserId },
        });

        if (!on) return;

        const allRecipes = recipesPage.data.message ?? [];
        const userRecipes = allRecipes.filter(
          (r) => String(r.authorId) === profileUserId
        );

        setMyRecipes(userRecipes);
        setMyCursor(recipesPage.data.last ?? null);

        // Fetch user's favorites (only if owner)
        if (isOwner) {
          const favsPage = await axios.get("/favorites");
          if (on) {
            setFavs(favsPage.data.message ?? []);
            setFavCursor(favsPage.data.last ?? null);
          }
        }
      } catch (e) {
        const msg =
          e.response?.data?.message ||
          e.message ||
          "An unexpected error occurred.";
        if (on) setError(msg);
      } finally {
        if (on) setLoading(false);
      }
    })();

    return () => {
      on = false;
    };
}, []);

  // -----------------------------------------
  // Pagination (Load More)
  // -----------------------------------------
  async function loadMore() {
    const usingMy = activeTab === "myRecipes";
    const cursor = usingMy ? myCursor : favCursor;
    if (!cursor) return;

    setLoadingMore(true);
    try {
      const params = { last: cursor };
      if (usingMy && userId) params.by = userId;

      const page = await axios.get(usingMy ? "/recipes" : "/favorites", {
        params,
      });

      let items = page.data.message ?? [];
      const last = page.data.last ?? null;

      if (usingMy) {
        items = items.filter((r) => String(r.authorId) === userId);
        setMyRecipes((prev) => [...prev, ...items]);
        setMyCursor(last);
      } else {
        setFavs((prev) => [...prev, ...items]);
        setFavCursor(last);
      }
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.message ||
          "Could not load more items."
      );
    } finally {
      setLoadingMore(false);
    }
  }

  const listForUI = useMemo(() => {
    const src = activeTab === "myRecipes" ? myRecipes : favs;

    return src.map((r, idx) => ({
      key: r.id ?? idx,
      title: r.name,
      author: activeTab === "myRecipes" ? "You" : r.authorName || "Unknown",
      likes: r.likes ?? 0,
      profilePic: activeTab === "myRecipes" ? avatarUrl : r.authorDp || "",
      img: r.imageUrl ?? "",
    }));
  }, [activeTab, myRecipes, favs, avatarUrl]);

  const hasMore = activeTab === "myRecipes" ? !!myCursor : !!favCursor;


  return (
    <div className="min-h-screen  bg-[#fafafa] m-4 text-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-[#fafafa] dark:m-0">
      <Link variant="ghost" onClick={() => navigate(-1)}>
        <div className="flex m-4 p-3 space-x-3 dark:m-0">
          <ArrowLeft className="cursor-pointer" />
          <button className=" text-xl font-medium cursor-pointer hover:underline md:font-light">
            Back
          </button>
        </div>
      </Link>

      <div className="max-w-[900px] my-[40px] mx-[auto] px-[40px]">
        <div className="w-full rounded-2xl mb-6 flex space-x-2 bg-white dark:bg-[#1a1a1a] shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="mt-8 mb-8 p-8 mr-5 sm:mr-4 md:mr-6">
            <img
              className=" rounded-full border w-[200px] h-[200px] object-cover sm:rounded-full md:rounded-full"
              src={avatarUrl}
              alt="Profile"
            />
          </div>

          <div className="space-y-4 mt-4">
            <div>
             <p className="text-sm font-semibold text-gray-500">Name</p> 
            <p className="text-xl font-medium">{displayName}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500">Bio</p>
            <p className="text-base">{bio}</p>
            </div>

           {location && (
            <div>
            <p className="text-sm font-semibold text-gray-500">Location</p>
            <p className="text-base">{location}</p>
            </div>
           )}

            <div className="flex items-center space-x-7 mt-8">
              <div>
                <p className="font-bold text-xl text-gray-600">
                  {myRecipes.length}
                </p>
                <p className="text-xl">Recipes</p>
              </div>
              <div>
                <p className="font-bold text-xl">{Math.max(0, myRecipes.reduce((a, r) => a + (r.likes ?? 0), 0)
              )}
                </p>
                <p className="text-[#1a1a1a] dark:text-[#fafafa] text-xl">
                  Total Likes
                </p>
              </div>
            </div>
          {isOwner && (
            <button onClick={() => navigate("/settings")} className="font-bold flex items-center bg-[#ff6b6b] text-white hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] transition-all duration-300 rounded-xl p-3 mt-4 ">
              <Settings size={16} strokeWidth={1.75} />
              Settings
            </button>
             )}
          </div>
        </div>
          

        <div className="flex space-x-20 mt-4 text-[#1a1a1a] border-b border-b-gray-600 dark:text-white">
          <button
            onClick={() => setActiveTab("myRecipes")}
            className={`pb-2 text-xl ${
              activeTab === "myRecipes"
                ? "border-b-2 border-[#ff6b6b] text-[#ff6b6b]"
                : "hover:border-b-gray-400 dark:hover:border-white/30"
            }`}
          >
            {isOwner ? "My Recipes" : "Recipes"}
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab("favorites")}
              className={`pb-2 text-xl ${
                activeTab === "favorites"
                  ? "border-b-2 border-[#ff6b6b] text-[#ff6b6b]"
                  : "hover:border-b-gray-400 dark:hover:border-white/30"
              }`}
            >
              Favorites
            </button>
          )}
        </div>

        <div className="m-10 mt-20">
          {listForUI.length === 0 ? (
            <p className="text-center text-gray-500">
              No {activeTab === "myRecipes" ? "recipes" : "favorites"} yet.
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
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
