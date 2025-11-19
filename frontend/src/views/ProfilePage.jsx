import { useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import RecipesList from '../components/RecipeList';
import { Link } from 'react-router-dom';

var rData = [
  {
    key: 0,
    title: 'Chocolate Chip Cookies',
    author: 'Lis Park',
    likes: 183,
    profilePic: '',
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
  },
  {
    key: 1,
    title: 'Creamy Mushroom Pasta',
    author: 'Sara Chen',
    likes: 189,
    profilePic: '',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
  },
  {
    key: 2,
    title: 'Fresh Garden Salad Bowl',
    author: 'Sara Chen',
    likes: 103,
    profilePic: '',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
  },
  {
    key: 3,
    title: 'Creamy Mushroom Pasta',
    author: 'Sara Chen',
    likes: 203,
    profilePic: '',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
  },
];

const profileBio = [
  {
    id: 1,
    name: 'Emma Rossi',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Home chef & food enthusiast sharing my favorite comfort food recipes. Passionate about Italian cuisine and creating simple, delicious meals for everyday cooking.',
    recipesCount: 24,
    totalLikes: 12.5,
  },
];

export default function Profile() {
  const profile = profileBio[0];
  const [activeTab, setActiveTab] = useState('myRecipes');

  return (
    <div className="min-h-screen  bg-[#fafafa] m-4 text-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-[#fafafa] dark:m-0 transition-colors duration-300">
      <Link to={`/`}>
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
              className=" rounded-full w-200 object-cover sm:rounded-full md:rounded-full ring-2 ring-gray-200 dark:ring-white/10 shadow-md dark:shadow-[0_4px_18px_rgba(255,255,255,0.04)]"
              // src={profile.img}
              src={'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
              alt="Profile Image"
            />
          </div>

          <div className="md:space-y-10  sm:space-x-2 m-6 p- ">
            <h3 className="font-bold text-5xl">{profile.name}</h3>
            <p className="text-[16px] sm:text-[12px] md:text-[16px] mt-4 items-center text-gray-700 dark:text-gray-300">
              {profile.bio}
            </p>

            <div className="flex items-center space-x-7 mt-8">
              <div>
                <p className="font-bold text-xl text-gray-600 dark:text-gray-400">
                  {profile.recipesCount}
                </p>
                <p className="text-[#1a1a1a] dark:text-[#fafafa] text-xl">Recipes</p>
              </div>
              <div>
                <p className="font-bold text-xl text-gray-600 dark:text-gray-400">
                  {profile.totalLikes}K
                </p>
                <p className="text-[#1a1a1a] dark:text-[#fafafa] text-xl">Total Likes</p>
              </div>
            </div>

            <button className="font-bold flex items-center bg-[#ff6b6b] text-white hover:brightness-110 active:scale-95 transition-all duration-300 rounded-xl p-3 mt-4 shadow-md hover:shadow-lg">
              <Settings size={16} strokeWidth={1.75} />
              Settings
            </button>
          </div>
        </div>

        <div className="flex space-x-20 mt-4 text-[#1a1a1a] border-b border-gray-300 dark:border-white/10 border-b-gray-600 dark:text-white">
          <button
            onClick={() => setActiveTab('myRecipes')}
            className={`cursor-pointer pb-2 border-b-2 text-xl ${
              activeTab === 'myRecipes'
                ? 'border-b-2 border-[#ff6b6b] text-[#ff6b6b]'
                : 'border-b-2 border-transparent hover:border-b-gray-400 dark:hover:border-white/30'
            }`}
          >
            My Recipes
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`cursor-pointer pb-2 border-b-2 text-xl ${
              activeTab === 'favorites'
                ? 'border-b-2 border-[#ff6b6b] text-[#ff6b6b]'
                : 'border-b-2 border-transparent hover:border-b-gray-400 dark:hover:border-white/30'
            }`}
          >
            Favorites
          </button>
        </div>

        <div className="m-10 mt-20 transition-all duration-300">
          <RecipesList recipes={rData} />
        </div>
      </div>
    </div>
  );
}
