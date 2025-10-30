import React from "react";

var userName = "Daniel";

const hour = new Date().getHours();
let greeting = "";
if (hour < 12) {
  greeting = "morning";
} else if (hour < 18) {
  greeting = "afternoon";
} else {
  greeting = "evening";
}

const DashBoard = () => {
  return (
    <section className="min-h-screen bg-[#fafafa]">
      <div className="m-2 max-w-[900px] my-[40px] mx-[auto] px-[40px] dark:text-[#fafafa]">
        
        <div className="border flex flex-col bg-blue-500 text-white rounded-3xl mt-4 p-7 space-y-3">
          <p className="font-medium text-xl mt-2">Good {greeting}</p>
          <h1 className="font-bold text-4xl mt-2">
            Welcome back, {userName}! 👋
          </h1>
          <button className="bg-white text-blue-500 font-medium rounded-2xl w-40 h-10 p-2 mt-9 items-center ">
            + Create Recipe
          </button>
        </div>

        <DashBoard />
        <DashBoard />
        <DashBoard />
        <DashBoard />
      </div>
    </section>
  );
};

export default DashBoard;
