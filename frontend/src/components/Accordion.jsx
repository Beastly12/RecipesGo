import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      {/* Header Section */}
      <div
        onClick={toggleAccordion}
        className="cursor-pointer flex justify-between items-center bg-white dark:bg-[#1a1a1a] shadow dark:shadow-lg dark:shadow-black/50 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors p-6 lg:p-7"
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Description
        </h3>
        <ChevronDown
          className={`w-6 h-6 transform transition-transform duration-300 text-gray-600 dark:text-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Content Section */}
      {isOpen && (
        <div className="mt-4 p-6 lg:p-7 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 rounded-2xl shadow dark:shadow-lg dark:shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-300">
          {sections?.map((section) => (
            <p key={section.id} className="mb-4 last:mb-0 leading-relaxed text-base">
              {section.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};