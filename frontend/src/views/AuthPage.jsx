import React, { useState } from "react";
import { CookingPot } from "lucide-react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

function FeaturesList() {
  return [
    { icon: "⭐", text: "Share your favorite recipes" },
    { icon: "💬", text: "Connect with other chefs" },
    { icon: "❤️", text: "Save recipes you love" },
    { icon: "📞", text: "Access anywhere, anytime" },
  ];
}

const AuthPage = () => {
  const features = FeaturesList();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
      {/* Left Side Panel */}
      <div className="hidden md:bg-[#FF6B6B] md:flex text-white flex-col justify-center items-center md:items-start md:w-1/2 w-full p-8 md:p-16 rounded-b-4xl md:rounded-none md:rounded-r-4xl">
        <CookingPot className="text-black bg-[#FF6B6B] w-32 h-32 md:w-60 md:h-60 mb-6 md:mb-10" />

        <h1 className="text-5xl md:text-4xl font-bold mb-4 md:mb-8 text-center md:text-left">
          Prepify
        </h1>

        <p className="text-base md:text-xl mb-8 md:mt-5 md:mb-20 text-center md:text-left">
          Join our community of food lovers and discover thousands of delicious
          recipes.
        </p>

        <ul className="space-y-4 md:space-y-9 text-base md:text-[18px]">
          {features.map((feature) => (
            <li key={feature.text} className="flex items-center space-x-3">
              <span className="text-xl">{feature.icon}</span>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side Panel */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 md:p-16 ">
        <div className=" flex flex-row justify-center items-center mb-10 md:mb-16">
          <CookingPot className=" w-40 h-20 m-2 md:w-40 md:h-30 pr-7 text-[#FF6B6B]" />
          <h1 className=" font-bold text-5xl md:text-5xl text-gray-800">
            Prepify
          </h1>
        </div>

        {/* Toogle Buttons */}
        <div className="flex items-center border border-gray-300 rounded-3xl p-1 overflow-hidden w-full mt-10 h-15 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 text-[#FF6B6B] font-semibold transition ${
              isLogin
                ? "text-[#FF6B6B] bg-white border-1 border-gray-500 rounded-4xl "
                : "text-gray-500 hover:text-[#FF6B6B]"
            }}`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 font-semibold transition ${
              !isLogin
                ? "text-[#FF6B6B] bg-white border-1 border-gray-500 rounded-4xl"
                : "text-gray-500 hover:text-[#FF6B6B]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        {isLogin ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

export default AuthPage;
