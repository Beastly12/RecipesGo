import React from "react";

const LoginForm = () => {
  return (
    <>
      <form className="space-y-7 w-full mt-4 p-3 ">
        <div>
          <label className="block text-2xl font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] md:text-sm md:font-light"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-2xl font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="email"
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] md:text-sm md:font-light"
          />

          <button className=" self-end mt-9 cursor-pointer text-[#FF686B] font-medium hover:underline transition-colors duration-200 hover:text-[#ff4a4a]">
            Forget password?
          </button>
        </div>

        <button className="w-full items-center p-3 mt-7 font-medium rounded-3xl bg-[#FF686B] text-2xl text-white focus:ring-2 focus:ring-[#FF486B] md:font-medium">
          Login
        </button>
      </form>
    </>
  );
};

export default LoginForm;
