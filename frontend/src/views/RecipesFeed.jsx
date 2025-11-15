import { useEffect, useState } from 'react';
import FilterTab from '../components/FilterTab';
import RecipesList from '../components/RecipeList';
import useDarkMode from '../hooks/useDarkMode';
import HeroSection from '../components/HeroSection';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { getAllRecipes } from '../services/RecipesService.mjs';
import Header from '../components/Header';

export default function RecipeFeed() {
  const [userId, setUserId] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [hasMore, setMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lastKey, setLastkey] = useState('');
  const [loading, setLoading] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { userId } = await getCurrentUser();
        console.log(userId);
        setUserId(userId);
        const session = await fetchAuthSession();
        console.log('access token', session.tokens.accessToken.toString());
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

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
          setRecipes([...data]);
          setLastkey(response.data.last);
          setMore(!(response.data.last === ''));
        }
      } catch (error) {
        if (isMounted) console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    return () => {
      isMounted = false;
    };
  }, []);

  const fData = [
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

      const recipesData = data.message.map((recipe) => ({
        key: recipe.id,
        title: recipe.name,
        author: recipe.authorName,
        likes: recipe.likes,
        profilePic: recipe.authorDpUrl,
        img: recipe.imageUrl,
      }));

      setRecipes(recipesData);
      setMore(Boolean(data.last));
      setLastkey(data.last);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = async () => {
    const params = {};

    if (selectedCategory) params.category = selectedCategory;
    if (lastKey) params.last = lastKey;
    try {
      setLoading(true);
      const response = await getAllRecipes(params);
      const data = response.data.message.map((recipe) => ({
        key: recipe.id,
        title: recipe.name,
        author: recipe.authorName,
        likes: recipe.likes,
        profilePic: recipe.authorDpUrl,
        img: recipe.imageUrl,
      }));
      setRecipes((prev) => [...prev, ...data]);
      const nextKey = response?.data?.last ?? '';
      setLastkey(nextKey);
      setMore(Boolean(nextKey));
    } catch (error) {
      console.error('Pagination error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#fafafa] min-h-screen font-sans transition-colors duration-300">
      <Header userId={userId} colorTheme={colorTheme} setTheme={setTheme} />

      <HeroSection />

      <div className="sticky top-15 md:top-20 z-30 bg-[#fafafa] dark:bg-[#1a1a1a] transition-colors duration-300">
        <FilterTab filterData={fData} onTabClick={handleFilter} />
      </div>

      <RecipesList
        recipes={recipes}
        hasmore={hasMore}
        handlePagination={handlePagination}
        loading={loading}
      />
    </div>
  );
}
