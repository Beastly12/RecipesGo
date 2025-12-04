import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = ({ userId }) => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    {
      name: 'Profile',
      path: userId ? `/profile/${userId}` : '/profile', // fallback
    },
  ];

  return (
    <footer className="bg-[#ffffff] dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 shadow-md dark:shadow-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold text-[#ff6b6b] dark:text-[#ff6b6b] tracking-tight">
              Prepify
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-4 leading-relaxed">
              Discover, create & share recipes from cooks around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-300 hover:text-[#ff6b6b] dark:hover:text-[#ff9470] transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              {['Breakfast', 'Lunch & Dinner', 'Desserts', 'Beverages'].map((item) => (
                <li
                  key={item}
                  className="text-gray-600 dark:text-gray-300 hover:text-[#ff6b6b] dark:hover:text-[#ff9470] cursor-pointer transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-110 flex items-center justify-center transition transform"
                >
                  <Icon size={20} className="text-gray-700 dark:text-gray-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Prepify. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:text-[#ff6b6b] dark:hover:text-[#ff9470] transition">
              Privacy Policy
            </a>
            <a className="hover:text-[#ff6b6b] dark:hover:text-[#ff9470] transition">Terms</a>
            <a className="hover:text-[#ff6b6b] dark:hover:text-[#ff9470] transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
