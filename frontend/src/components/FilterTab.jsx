import React, { useState } from 'react';

const FilterTab = ({ filterData, onTabClick }) => {
  const [isActive, setActive] = useState(0);

  const handleTabClick = (tab) => {
    setActive(tab.key);
    onTabClick(tab.title);
  };

  return (
    <>
      <div className="px-10 py-6 flex gap-3 overflow-x-auto">
        {filterData.map((data) => (
          <button
            key={data.key}
            onClick={() => handleTabClick(data)}
            className={`px-5 py-2 rounded-full border-1  ${data.key === isActive ? 'bg-[#ff6b6b] border-[#ff6b6b] text-white ' : 'bg-white dark:bg-[#1a1a1a] hover:bg-[#ff6b6b] hover:text-white border-gray-300 dark:border-slate-800  text-base'} transition transform text-sm font-medium cursor-pointer whitespace-nowrap`}
          >
            {data.title}
          </button>
        ))}
      </div>
    </>
  );
};

export default FilterTab;
