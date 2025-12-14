import React, { useEffect, useState } from 'react';
import DashBoardCard from '../components/DashBoardCard';
import { HeartIcon, NotebookPen, Eye, MessageCircleMore } from 'lucide-react';
import DashBoardManagementTable from '../components/DashBoardManagementTable';
import { getUser } from '../services/UserService.mjs';
import { getMyRecipes, getRecipesByUser } from '../services/RecipesService.mjs';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useDarkMode from '../hooks/useDarkMode';
import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Menu, Avatar, Drawer } from 'antd';
import { handleSignOut } from '../services/AuthService.mjs';

const hour = new Date().getHours();
const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

const DashBoard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialRecipes, setInitialRecipes] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [colorTheme] = useDarkMode();
  const { user, userName } = useAuthContext();

  const userEmail = user?.userId ? `${user.userId.substring(0, 10)}...` : '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userId) return;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [userStatsRes, userRecipesRes] = await Promise.all([
          getUser(),
          // console.log(user),
          // getRecipesByUser(user.userId),
          getMyRecipes(),
          // console.log(user.userId)
        ]);

        const userRecipes = userRecipesRes.data?.message || [];
        setInitialRecipes(userRecipes);

        setStats({
          ...userStatsRes,
          recipeCount: userRecipes.length,
          likes: userStatsRes.likes ?? 0,
          overallRating: userStatsRes.overallRating ?? 0,
          views: userStatsRes.views ?? 0,
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    await handleSignOut();
    localStorage.clear();
    window.location.href = '/';
  };

  // Skeleton card
  const SkeletonCard = () => (
    <div className="animate-pulse relative overflow-hidden p-6 rounded-2xl border border-gray-200 dark:border-gray-500 bg-white dark:bg-[#1a1a1a]">
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 w-3/4 mb-2 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 rounded"></div>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] dark:text-[#e4e7eb]">
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white dark:bg-[#1a1a1a] px-10 py-4 shadow-sm sticky top-0 z-50 items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] transition"
        >
          <span className="font-medium text-gray-700 dark:text-[#fafafa]">Back</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-[#fafafa]">Dashboard</h1>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-[#1a1a1a] px-4 py-3 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-xl font-bold text-[#ff6b6b] dark:text-[#ff8080] whitespace-nowrap"
          >
            Prepify
          </Link>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            <MenuOutlined style={{ fontSize: '20px' }} />
          </button>
        </div>
      </header>

      <Drawer
        title={null}
        placement="right"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={280}
        bodyStyle={{
          padding: 0,
          background: colorTheme === 'white' ? 'light' : 'dark',
        }}
      >
        <div className="p-4">
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)' }}
          >
            <div className="flex items-center gap-3">
              <Avatar
                size={48}
                style={{
                  background: 'rgba(255,255,255,0.3)',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                {userName?.charAt(0)}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{userName}</div>
                <div className="text-xs text-white/80 truncate">{userEmail}</div>
              </div>
            </div>
          </div>

          <Menu mode="inline" style={{ borderRight: 0, background: 'transparent' }}>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              <Link to={`/profile/${user?.userId}`}>Profile</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              <Link to="/settings">Settings</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              key="logout"
              icon={<LogoutOutlined />}
              style={{ color: '#ff4d4f' }}
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Drawer>

      <div className="m-2 max-w-[900px] mx-auto px-[40px] dark:text-[#fafafa] p-8">
        {/* Greeting & Create */}
        <div
          className="flex flex-col bg-[#ff6b6b] text-white dark:bg-gradient-to-br dark:bg-[#1a1a1a] dark:text-[#fafafa]
          rounded-3xl mt-4 mb-2 p-7 space-y-3 shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
          transition-all duration-300"
        >
          {loading ? (
            <>
              <div className="h-6 w-32 bg-white/70 animate-pulse rounded"></div>
              <div className="h-10 w-64 bg-white/70 animate-pulse rounded"></div>
              <div className="h-10 w-40 bg-white/70 animate-pulse rounded mt-2"></div>
            </>
          ) : (
            <>
              <p className="font-medium text-xl mt-2">Good {greeting}</p>
              <h1 className="font-bold text-3xl mt-2">Welcome back, {stats?.name}! 👋</h1>
              <p className="font-medium text-xl mt-2">
                Here is what's happening with your recipes today.
              </p>

              <Link to={'/createRecipe'}>
                <button
                  className="bg-white text-blue-600 dark:bg-[#ff6b6b] dark:text-white font-medium rounded-2xl w-40 h-10 p-2 mt-9
                  hover:scale-[1.03] transition-transform duration-300"
                >
                  + Create Recipe
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Dashboard Cards */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            <DashBoardCard
              icon={<NotebookPen className="w-12 h-12 text-yellow-500" />}
              value={stats?.recipeCount ?? 0}
              title="Total Recipes"
            />
            <DashBoardCard
              icon={<Eye className="w-12 h-12 text-blue-500" />}
              value={stats?.views ?? 0}
              title="Total Views"
            />
            <DashBoardCard
              icon={<HeartIcon className=" w-12 h-12 text-red-500" />}
              value={stats?.likes ?? 0}
              title="Total Likes"
            />
            <DashBoardCard
              icon={<MessageCircleMore className="w-12 h-12 text-purple-500" />}
              value={stats?.overallRating ?? 0}
              title="Total Comments"
            />
          </div>
        )}

        <DashBoardManagementTable
          userId={user?.userId}
          initialRecipes={initialRecipes}
          loading={loading}
          onRecipeCountChange={(count) => setStats((prev) => ({ ...prev, recipeCount: count }))}
        />
      </div>
    </section>
  );
};

export default DashBoard;
