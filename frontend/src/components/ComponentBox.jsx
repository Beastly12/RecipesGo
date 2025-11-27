import React from 'react';
import Modal from 'react-modal';
import { useEffect } from 'react';
import { useModal } from '../context/CustomModalContext';
import CustomInput from './CustomInput';

Modal.setAppElement('#root');

const CommentBox = ({
  totalComments,
  visibleComments,
  hasMore,
  handleViewMore,
  handlePopupOpen,
  handlePopupClosed,
  isPopupOpen,
  comment,
  setComment,
  starRating,
  setStarRating,
  handleComment,
  handleRatings,
  recipeId,
  lastKey,
}) => {

  const {openModal, closeModal} = useModal()

  return (
    <div className="bg-white dark:bg-[#1e1e1e] mt-14 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_24px_rgba(255,255,255,0.05)] mb-8 transition-colors duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="font-bold text-3xl text-gray-800 dark:text-gray-100">
          Comments ({totalComments.length})
        </h2>
        <button
          onClick={() => {
            openModal(
              <div>
                <h2 className="text-xl font-bold dark:text-white">DROP A COMMENT</h2>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setStarRating(star)}
              className={`px-4 py-2 rounded-lg hover:bg-[#ff6b6b] ${
                star <= starRating ? 'bg-[#ff6b6b] text-white' : 'bg-white'
              }`}
            >
              ⭐
            </button>
          ))}
        </div>

        <label className="block">
          Write your comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg dark:bg-[#2a2a2a] dark:text-white"
            rows={4}
            cols={40}
          />
        </label>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleComment}
            className="mt-6 px-4 py-2 bg-[#ff6b6b] text-white rounded-lg hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)]"
          >
            Save
          </button>
          <button
            onClick={handlePopupClosed}
            className="mt-6 px-4 py-2 bg-[#ff6b6b] text-white rounded-lg hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)]"
          >
            Cancel
          </button>
        </div>
              </div>
            )
          }}
          className="px-4 py-2 bg-[#ff6b6b] text-white rounded-xl hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)]"
        >
          DROP A COMMENT!
        </button>
      </div>

      {totalComments?.slice(0, visibleComments).map((comment) => (
        <div
          key={comment.key}
          className="flex items-start gap-3 bg-gray-50 dark:bg-[#2a2a2a] p-3 rounded-lg mb-3 border-b border-gray-300 dark:border-gray-700 transition-colors duration-500"
        >
          <img src={comment.profilePic} alt={comment.name} className="w-10 h-10 rounded-full" />
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-100">{comment.name}</h4>
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
