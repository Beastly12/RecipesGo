import React from 'react';
import Modal from "react-modal";

Modal.setAppElement("#root");


const CommentBox = ({ totalComments, visibleComments, hasMore, handleViewMore, handlePopupOpen, handlePopupClosed, isPopupOpen }) => {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] mt-14 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_24px_rgba(255,255,255,0.05)] mb-8 transition-colors duration-500">
      <h2 className="font-bold text-3xl mb-10 text-gray-800 dark:text-gray-100">
        Comments ({totalComments.length}) 
      </h2>

      <button
        onClick={handlePopupOpen}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        DROP A COMMENT!
      </button>

      <Modal
        isOpen={isPopupOpen}
        onRequestClose={handlePopupClosed}
        className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-xl max-w-md mx-auto mt-24 outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
      >
        <h2 className="text-xl font-bold dark:text-white">DROP A COMMENT</h2>
        <p className="mt-2 dark:text-gray-200">
        <label>
          Write your post:
         <textarea name="postContent" rows={4} cols={40} />
        </label>
        </p>
        <button
          onClick={handlePopupClosed}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </Modal>

      {totalComments?.slice(0, visibleComments).map((comment) => (
        <div
          key={comment.id}
          className="flex items-start gap-3 bg-gray-50 dark:bg-[#2a2a2a] p-3 rounded-lg mb-3 border-b border-gray-300 dark:border-gray-700 transition-colors duration-500"
        >
          <img
            src={comment.user.profilePic}
            alt={comment.user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-100">{comment.user.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{comment.posted}</p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{comment.text}</p>
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
