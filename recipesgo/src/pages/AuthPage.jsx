import React, { useState } from "react";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
      <div className="bg-[#FF6B6B] text-white flex flex-col justify-center md:w-1/2 w-full p-10 rounded-b-3xl md:rounded-none md:rounded-r-3xl">
        <div className="flex items-center mb-4">
          <div className="bg-black text-white font-bold text-6xl rounded-md px-6 py-4 mr-2">
            P
          </div>
          <h1 className="text-7xl font-bold ml-20">Prepify</h1>
        </div>

        <p className="mt-20 text-2xl font-medium mb-10">
          Join our community of food lovers and discover thousands of delicious
          recipes.
        </p>

        <ul className="space-y-8 mt-20 text-2xl font-light">
          <li className="flex items-center space-x-2 font-medium">
            <span>⭐</span>
            <span>Share your favorite recipes</span>
          </li>
          <li className="flex items-center space-x-2 font-medium">
            <span>💬</span>
            <span>Connect with other chefs</span>
          </li>
          <li className="flex items-center space-x-2 font-medium">
            <span>❤️</span>
            <span>Save recipes you love</span>
          </li>
          <li className="flex items-center space-x-2 font-medium">
            <span>📞</span>
            <span>Access anywhere, anytime</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col justify-center items-center md:w-1/2 w-full p-6 md:p-12 border">
        <div className="flex items-center mb-6 mt-3">
          <div className="bg-black text-white font-bold text-3xl rounded-md px-6 py-4 mr-2">
            P
          </div>
          <h1 className="text-6xl font-semibold text-[#FF6B6B]">Prepify</h1>
        </div>

        <div className="flex border border-gray-300 rounded-xl p-1 overflow-hidden w-full mt-10 h-15 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium transition-colors rounded-2xl ${
              isLogin
                ? "bg-[#fafafa]] text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium transition-colors rounded-2xl ${
              !isLogin
                ? "bg-[#FF6B6B] text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="w-full max-w-xs space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-sm text-[#FF6B6B] hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#FF6B6B] text-white py-2 rounded-md hover:bg-[#ff5959] transition-colors"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
