import React from "react";

const DashBoardCard = ({ icon, value, title }) => {
  return (
    <div className="bg-[#fafafa] p-4 rounded-2xl mt-3 flex shadow hover:shadow-lg transition-all duration-300 border-t-2 border-t-blue-300 ">

      <div className="p-2">
        <div className="">{icon}</div>

        <div className="mt-5">
          <p className="font-bold text-4xl">{value}</p>
          <p className="text-[14px] text-gray-500">{title}</p>
        </div>

      </div>
    </div>
  );
};

export default DashBoardCard;