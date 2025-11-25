import { useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Dropdown, Menu, Avatar, Drawer, Button } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { handleSignOut } from '../services/AuthService.mjs';

export default function Header({ userId, colorTheme, setTheme, userName, profilePic }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const userEmail = userId ? `${userId.substring(0, 10)}...` : '';

  const handleLogout = async () => {
    await handleSignOut();
    localStorage.clear();
    window.location.href = '/';
  };

  // Desktop Dropdown Menu
  const dropdownMenu = (
    <Menu
      className={colorTheme === 'dark' ? 'dark-menu' : 'light-menu'}
      style={{
        width: 280,
        borderRadius: '16px',
        padding: '8px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        background: colorTheme === 'dark' ? 'white' : '#2a2a2a',
        border: colorTheme === 'dark' ? '1px solid #f0f0f0' : '1px solid #404040',
      }}
    >
      {/* User Info Header */}
      <Menu.Item
        key="user-info"
        disabled
        style={{
          height: 'auto',
          padding: '16px',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
          borderRadius: '12px',
          marginBottom: '8px',
          cursor: 'default',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            src={profilePic}
            size={48}
            style={{
              background: 'rgba(255,255,255,0.3)',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            {userName.charAt(0)}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                color: 'white',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userName}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.8)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userEmail}
            </div>
          </div>
        </div>
      </Menu.Item>

      <Menu.Divider />

      {/* Menu Items */}
      <Menu.Item
        key="dashboard"
        icon={<DashboardOutlined style={{ fontSize: '16px' }} />}
        style={{ borderRadius: '8px', margin: '4px 0' }}
      >
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>

      <Menu.Item
        key="profile"
        icon={<UserOutlined style={{ fontSize: '16px' }} />}
        style={{ borderRadius: '8px', margin: '4px 0' }}
      >
        <Link to={`/profile/${userId}`}>Profile</Link>
      </Menu.Item>

      <Menu.Item
        key="settings"
        icon={<SettingOutlined style={{ fontSize: '16px' }} />}
        style={{ borderRadius: '8px', margin: '4px 0' }}
      >
        <Link to="/settings">Settings</Link>
      </Menu.Item>

      <Menu.Divider />

      {/* Logout */}
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined style={{ fontSize: '16px' }} />}
        onClick={handleLogout}
        style={{
          borderRadius: '8px',
          margin: '4px 0',
          color: '#ff4d4f',
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white hidden md:flex dark:bg-[#1a1a1a] px-10 py-4 shadow-sm sticky top-0 z-50 items-center justify-between">
        <Link to={'/'} className="text-2xl font-bold text-[#ff6b6b] dark:text-[#ff8080]">
          Prepify
        </Link>

        <div className="flex-1 max-w-xl mx-10 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <SearchOutlined />
          </span>
          <input
            type="text"
            placeholder="Search recipes, ingredients, or chefs..."
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 dark:border-gray-700 dark:bg-[#2a2a2a] dark:text-white text-sm focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <span
            onClick={() => setTheme(colorTheme)}
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            {colorTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </span>

          <Link to={'/createRecipe'}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                background: '#ff6b6b',
                borderColor: '#ff6b6b',
                borderRadius: '20px',
                height: '40px',
                fontWeight: 600,
              }}
            >
              Create Recipe
            </Button>
          </Link>

          {userId ? (
            <Dropdown overlay={dropdownMenu} trigger={['click']} placement="bottomRight">
              <Avatar
                src={profilePic}
                size={40}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {userName.charAt(0)}
              </Avatar>
            </Dropdown>
          ) : (
            <Link to={'/Auth'}>
              <Button
                style={{
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  borderRadius: '20px',
                  height: '40px',
                  fontWeight: 600,
                }}
              >
                Login/Signup
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-[#1a1a1a] px-4 py-3 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={'/'}
            className="text-xl font-bold text-[#ff6b6b] dark:text-[#ff8080] whitespace-nowrap"
          >
            Prepify
          </Link>

          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">
              <SearchOutlined />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 dark:bg-[#2a2a2a] dark:text-white border-none text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <span
              onClick={() => setTheme(colorTheme)}
              className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
            >
              {colorTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </span>

            {userId ? (
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
              >
                <MenuOutlined style={{ fontSize: '20px' }} />
              </button>
            ) : (
              <Link to={'/Auth'}>
                <Button
                  size="small"
                  style={{
                    borderColor: '#ff6b6b',
                    color: '#ff6b6b',
                    borderRadius: '20px',
                    fontWeight: 600,
                    background: `${colorTheme === 'dark' ? '#2a2a2a' : 'white'}`,
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        placement="right"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={320}
        styles={{
          body: { padding: 0 },
        }}
      >
        {/* User Header */}
        <div
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            marginBottom: '16px',
          }}
        >
          <Avatar
            src={profilePic}
            size={64}
            style={{
              background: 'rgba(255,255,255,0.3)',
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '12px',
            }}
          >
            {userName.charAt(0)}
          </Avatar>
          <div style={{ color: 'white', fontWeight: 600, fontSize: '18px' }}>{userName}</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{userEmail}</div>
        </div>

        {/* Menu Items */}
        <Menu mode="vertical" style={{ border: 'none' }}>
          <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined style={{ fontSize: '18px' }} />}
            onClick={() => setMobileDrawerOpen(false)}
          >
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>

          <Menu.Item
            key="profile"
            icon={<UserOutlined style={{ fontSize: '18px' }} />}
            onClick={() => setMobileDrawerOpen(false)}
          >
            <Link to={`/profile/${userId}`}>Profile</Link>
          </Menu.Item>

          <Menu.Item
            key="settings"
            icon={<SettingOutlined style={{ fontSize: '18px' }} />}
            onClick={() => setMobileDrawerOpen(false)}
          >
            <Link to="/settings">Settings</Link>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            key="logout"
            icon={<LogoutOutlined style={{ fontSize: '18px' }} />}
            onClick={() => {
              handleLogout();
              setMobileDrawerOpen(false);
            }}
            style={{ color: '#ff4d4f' }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Drawer>

      {/* Mobile Floating Action Button */}
      <Link to={'/createRecipe'}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<PlusOutlined />}
          className="md:hidden"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 40,
            width: '56px',
            height: '56px',
            background: '#ff6b6b',
            borderColor: '#ff6b6b',
            boxShadow: '0 4px 12px rgba(255,107,107,0.4)',
          }}
        />
      </Link>
    </>
  );
}
