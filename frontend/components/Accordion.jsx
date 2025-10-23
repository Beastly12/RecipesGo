import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Accordion = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-10 mb-4">
      {/* Header Section */}
      <div
        onClick={toggleAccordion}
        className="cursor-pointer flex justify-between items-center shadow-[0_12px_24px_rgba(0,0,0,0.12)] bg-gray-50 rounded-2xl hover:bg-gray-100 transition p-7"
      >
        <h3 className="text-xl font-semibold text-gray-800">Description</h3>
        <ChevronDown
          className={`w-7 h-7 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Content of the body */}
      {isOpen && (
        <div className="mt-4 p-5 text-gray-700 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] ">
          {sections?.map((section) => (
            <p key={section.id} className="mb-4 leading-relaxed text-[14px]">
              {section.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
