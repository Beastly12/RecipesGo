import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t shadow-md mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold text-[#ff6b6b] tracking-tight">
              Prepify
            </h3>
            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              Discover, create, and share amazing recipes from cooks around the world.
              Prepify brings flavor, creativity, and community together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-[#ff6b6b] transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-[#ff9470] transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-[#ff6b6b] transition"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-[#ff6b6b] cursor-pointer transition">
                Breakfast
              </li>
              <li className="text-gray-600 hover:text-[#ff9470] cursor-pointer transition">
                Lunch & Dinner
              </li>
              <li className="text-gray-600 hover:text-[#ff6b6b] cursor-pointer transition">
                Desserts
              </li>
              <li className="text-gray-600 hover:text-[#ff9470] cursor-pointer transition">
                Beverages
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Follow Us
            </h4>

            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-[#ff6b6b]/10 hover:bg-[#ff6b6b] text-[#ff6b6b] hover:text-white flex items-center justify-center transition">
                <Facebook size={20} />
              </a>

              <a className="w-10 h-10 rounded-full bg-[#ff9470]/10 hover:bg-[#ff9470] text-[#ff9470] hover:text-white flex items-center justify-center transition">
                <Instagram size={20} />
              </a>

              <a className="w-10 h-10 rounded-full bg-[#ff6b6b]/10 hover:bg-[#ff6b6b] text-[#ff6b6b] hover:text-white flex items-center justify-center transition">
                <Twitter size={20} />
              </a>

              <a className="w-10 h-10 rounded-full bg-gray-300/20 hover:bg-gray-400 text-gray-600 hover:text-white flex items-center justify-center transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Prepify. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:text-[#ff6b6b] transition">Privacy Policy</a>
            <a className="hover:text-[#ff9470] transition">Terms of Service</a>
            <a className="hover:text-[#ff6b6b] transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
