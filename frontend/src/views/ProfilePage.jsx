import React, { useState, useEffect, useMemo} from "react";
import { ArrowLeft, Settings } from "lucide-react";
import RecipesList from "../components/RecipeList";
import { useNavigate, Link } from "react-router-dom";
import axios from '../services/Axios.mjs'

export default function Profile() {
  const navigate =useNavigate();
  const [activeTab, setActiveTab] = useState("myRecipes");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
const [avatarUrl, setAvatarUrl] = useState("https://randomuser.me/api/portraits/lego/6.jpg")

const [myRecipes, setMyRecipes] = useState([]);
const [myCursor, setMyCursor] = useState(undefined);
const [favs, setFavs] = useState([]);
const [favCursor, setFavCursor] = useState(undefined);

const [loading , setLoading] = useState(true); 
const [error, setError] = useState(null);
const [loadingMore, setLoadingMore]= useState(false);
const [userId, setUserId] = useState(null);

useEffect(() =>{
  let on = true;
  (async () => {
    try{
      setLoading(true);
      setError(null);

  const userRes = await axios.get("/users");
  console.log("USER RES DATA:", userRes.data)
  const user = userRes.data.message;

    setDisplayName(user.name ?? "");
    setBio(user.bio ?? "");
    setLocation(user.location ?? "")
    setAvatarUrl(
      user.dpUrl && user.dpUrl.length > 0 
      ? user.dpUrl 
      : "https://randomuser.me/api/portraits/lego/6.jpg"
    );
    setUserId(user.userid)
    
  const recipesPage = await axios.get("/recipes", {
    params: {by: user.userid},
  });
  console.log("USER:",user);
  console.log("RECIPES RESPONSE:", recipesPage.data);
      if (!on) return;
      const allRecipes = recipesPage.data.message ?? [];
      if (allRecipes.length  > 0) {
        console.log("FIRST RECIPE OBJECT:", allRecipes[0]);
        console.log("FIRST RECIPE KEYS:", Object.keys(allRecipes[0]))
      }
      const userRecipes = allRecipes.filter(r => r.authorId === user.userid)
      setMyRecipes(userRecipes);
      setMyCursor(recipesPage.data.last ?? null);

      const favsPage = await axios.get("/favorites");
      if (!on) return;
      setFavs(favsPage.data.message ?? []);
      setFavCursor(favsPage.data.last ?? null);
    } catch (e){
      const msg =
      e.response?.data?.message || 
      `${e.response?.status || ""} ${e.response?.statusText || ""}`.trim() ||
      e.message || 
      "Something went wrong";
      if (on) setError(msg);
    } finally{
      if (on) setLoading(false);
    }
    }) (); 
    return () => {
      on = false;
    };
}, []);

async function loadMore(){
  const usingMy = activeTab === "myRecipes";
  const cursor = usingMy ? myCursor : favCursor;
  if (!cursor) return;

  setLoadingMore(true);
  try{
    const params = {last: cursor};
    if (usingMy && userId){
      params.userid = userId;
    }
    const page = await axios.get(usingMy ? "/recipes" : "/favorites", {params});
    console.log("LOAD MORE RAW PAGE:", page.data)
    let items = page.data.message ?? [];
    const last = page.data.last ?? null;
    if(usingMy) {
      items = items.filter (r => r.authorId === userId);
      setMyRecipes((prev) => [...prev, ...items]);
      setMyCursor(last);
    } else {
      setFavs((prev) => [...prev, ...items]);
      setFavCursor(last)
    }
  } catch (e){
    const msg = e.response?.data?.message || 
    `${e.response?.status || ""} ${e.response?.statusText || ""}`.trim() ||
    e.message ||
    "Could not load more";
    setError(msg);
  } finally {
    setLoadingMore(false)
  }
}

const listForUI = useMemo(()=> {
  const src  = activeTab ==="myRecipes" ? myRecipes : favs;
  return src.map((r, idx) => ({
    key: r.id ?? idx,
    title: r.name,
    author: activeTab === "myRecipes" ? "You" : r.authorName || "Unknown",
    likes: r.likes ?? 0,
    profilePic: avatarUrl,
    img: r.imageUrl ?? "",
  }));
}, [activeTab, myRecipes, favs, avatarUrl]);

const hasMore = activeTab === "myRecipes" ? !!myCursor : !!favCursor;


  return (
    <div className="min-h-screen  bg-[#fafafa] m-4 text-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-[#fafafa] dark:m-0">
      <Link to="/recipe-details">
        <div className="flex m-4 p-3 space-x-3 dark:m-0">
          <ArrowLeft className="cursor-pointer" />
          <button className=" text-xl font-medium cursor-pointer hover:underline md:font-light">
            Back
          </button>
        </div>
      </Link>

      <div className="max-w-[900px] my-[40px] mx-[auto] px-[40px]">
        <div className="w-full rounded-2xl mb-6 flex space-x-2">
          <div className="mt-8 mb-8 p-8 mr-5">
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
                <p className="font-bold text-xl">{myRecipes.length}</p>
                <p className="text-[#1a1a1a] dark:text-[#fafafa] text-xl">
                  Recipes
                </p>
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

            <button onClick={() => navigate("/settings")} className="font-bold flex items-center bg-[#ff6b6b] text-white hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] transition-all duration-300 rounded-xl p-3 mt-4 ">
              <Settings size={16} strokeWidth={1.75} />
              Settings
            </button>
          </div>
        </div>

        <div className="flex space-x-20 mt-4 text-[#1a1a1a] border-b border-b-gray-600 dark:text-white">
          <button
            onClick={() => setActiveTab("myRecipes")}
            className={`cursor-pointer pb-2 border-b-2 ${
              activeTab === "myRecipes"
                ? "border-b-[#ff6b6b]"
                : "border-b-transparent hover:border-b-gray-600"
            }`}
          >
            My Recipes
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`cursor-pointer pb-2 border-b-2 ${
              activeTab === "favorites"
                ? "border-b-[#ff6b6b]"
                : "border-b-transparent hover:border-b-gray-600"
            }`}
          >
            Favorites
          </button>
        </div>

        <div className="m-10 mt-20">
          <RecipesList recipes={listForUI} />
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
                >
                  {loadingMore ? "Loading...": "Load more"}
              </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
