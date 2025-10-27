import React from "react";

const CommentBox = ({
  totalComments,
  visibleComments,
  hasMore,
  handleViewMore,
}) => {
  return (
    <div className=" bg-[#fafafa] mt-14 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] mb-8">
      <h2 className="font-bold text-3xl mb-10  text-gray-800">
        Comments ({recipe_details.totalComments})
      </h2>

      {visibleComments?.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg mb-3 border-b border-gray-300"
        >
          <img
            src={comment.user.profilePic}
            alt={comment.user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-medium">{comment.user.name}</h4>
            <p className="text-sm text-gray-500">{comment.posted}</p>
            <p className="mt-1 text-gray-800">{comment.text}</p>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleViewMore}
            className="px-6 py-2 bg-[#ff6b6b] text-white rounded-full hover:bg-[#ff4b4b] transition-all shadow-[0_6px_16px_rgba(255,107,107,0.4)]"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentBox;
