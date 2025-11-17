import React from 'react';

const InstructionBox = ({ instructions }) => {
  return (
    <div className="p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] mt-6 bg-white">
      <h2 className="font-bold text-4xl mb-4">Instructions</h2>

      <ol className="space-y-10 text-[14px]">
        {instructions?.map((instruction, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ff6b6b] text-white font-bold">
              {index + 1}
            </div>

            <div className="text-gray-700 leading-relaxed">{instruction}</div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default InstructionBox;
