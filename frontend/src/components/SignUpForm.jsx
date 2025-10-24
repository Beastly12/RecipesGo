import React from "react";

const SignUpForm = () => {
  return (
    <>
      <form className="space-y-7 w-full mt-4 p-3 ">
        <div>
          <label className="block text-2xl font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="email"
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] md:text-sm md:font-light"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-2xl font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] md:text-sm md:font-light"
          />
        </div>

        <div>
          <label className="block text-2xl font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="email"
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] md:text-sm md:font-light"
          />
        </div>

        <button className="w-full items-center p-3 mt-7 font-medium rounded-3xl bg-[#FF686B] text-2xl text-white focus:ring-2 focus:ring-[#FF486B] md:font-medium">
          Sign Up
        </button>
      </form>
    </>
  );
};

export default SignUpForm;
