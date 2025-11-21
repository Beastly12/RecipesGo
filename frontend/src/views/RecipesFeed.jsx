import { useEffect, useState } from 'react';
import FilterTab from '../components/FilterTab';
import RecipesList from '../components/RecipeList';
import useDarkMode from '../hooks/useDarkMode';
import HeroSection from '../components/HeroSection';
import { getAllRecipes } from '../services/RecipesService.mjs';
import Header from '../components/Header';
import { useAuthContext } from '../context/AuthContext';
import { getUserDetails } from '../services/UserService.mjs';
import About from '../components/Footer';
import Footer from '../components/Footer';

export default function RecipeFeed() {
  const { user, loading: authLoading } = useAuthContext();

  const [recipes, setRecipes] = useState([]);
  const [hasMore, setMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lastKey, setLastkey] = useState('');
  const [loading, setLoading] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchuserDetails = async () => {
      setUserLoading(true);
      try {
        const res = await getUserDetails();
        setUserDetails(res);
      } catch (error) {
      } finally {
        setUserLoading(false);
      }
    };
    if (user) {
      fetchuserDetails();
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchRecipes = async () => {
      try {
        setLoading(true);

        const response = await getAllRecipes();
        const data = response.data.message.map((recipe) => ({
          key: recipe.id,
          title: recipe.name,
          author: recipe.authorName,
          likes: recipe.likes,
          profilePic: recipe.authorDpUrl,
          img: recipe.imageUrl,
        }));

        if (isMounted) {
          setRecipes(data);
          setLastkey(response.data.last);
          setMore(Boolean(response.data.last));
        }
      } catch (error) {
        if (isMounted) console.error('Failed to fetch recipes:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecipes();

    return () => (isMounted = false);
  }, []);

  const filterOptions = [
    { key: 0, title: 'All' },
    { key: 1, title: 'Breakfast' },
    { key: 2, title: 'Lunch' },
    { key: 3, title: 'Dinner' },
    { key: 4, title: 'Dessert' },
    { key: 5, title: 'Snacks' },
    { key: 6, title: 'Vegan' },
    { key: 7, title: 'Quick & Easy' },
  ];

  const handleFilter = async (category) => {
    const isAll = category === 'All';

    setSelectedCategory(isAll ? null : category);
    setLoading(true);

    try {
      const { data } = await getAllRecipes(isAll ? {} : { category });

      const formatted = data.message.map((recipe) => ({
        key: recipe.id,
        title: recipe.name,
        author: recipe.authorName,
        likes: recipe.likes,
        profilePic: recipe.authorDpUrl,
        img: recipe.imageUrl,
      }));

      setRecipes(formatted);
      setMore(Boolean(data.last));
      setLastkey(data.last);
    } catch (error) {
      console.error('Failed to filter recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = async () => {
    try {
      setLoading(true);

      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (lastKey) params.last = lastKey;

      const response = await getAllRecipes(params);

      const formatted = response.data.message.map((recipe) => ({
        key: recipe.id,
        title: recipe.name,
        author: recipe.authorName,
        likes: recipe.likes,
        profilePic: recipe.authorDpUrl,
        img: recipe.imageUrl,
      }));

      setRecipes((prev) => [...prev, ...formatted]);

      const nextKey = response.data.last ?? '';
      setLastkey(nextKey);
      setMore(Boolean(nextKey));
    } catch (error) {
      console.error('Pagination error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || userLoading) {
    return (
      <div className="bg-[#fafafa] text-[#1a1a1a] min-h-screen font-sans dark:bg-[#0a0a0a] dark:text-[#e5e5e5]">
        <div className="lg:max-w-[900px] py-10 lg:mx-auto px-5 lg:px-10">
          <div className="mb-5">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#fafafa] min-h-screen font-sans transition-colors duration-300">
      {/* Header now receives user from AuthContext */}
      <Header
        userId={user?.userId ?? null}
        colorTheme={colorTheme}
        setTheme={setTheme}
        userName={userDetails ? userDetails.name : ''}
      />

      <HeroSection />

      <div className="sticky top-15 md:top-20 z-30 bg-[#fafafa] dark:bg-[#1a1a1a] transition-colors duration-300">
        <FilterTab filterData={filterOptions} onTabClick={handleFilter} />
      </div>

      <RecipesList
        recipes={recipes}
        hasmore={hasMore}
        handlePagination={handlePagination}
        loading={loading}
      />
       <Footer/>
    </div>
   
  );
}
