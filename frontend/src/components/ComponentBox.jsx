import React, { useState } from 'react';
import { Modal, Popconfirm } from 'antd';
import { useAuthContext } from '../context/AuthContext';

const CommentBox = ({
  totalComments,
  visibleComments,
  hasMore,
  handleViewMore,
  handlePopupClosed,
  comment,
  setComment,
  starRating,
  setStarRating,
  handleComment,
}) => {
  const { openModal, closeModal } = useModal();

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
            );
          }}
          className="px-4 py-2 bg-[#ff6b6b] text-white rounded-xl hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)]"
        >
          DROP A COMMENT!
        </button>
      </div>

      {/* Comment Modal */}
      <Modal
        title={<span className="text-xl font-bold">DROP A COMMENT</span>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="comment-modal"
      >
        <div className="py-4">
          <div className="mb-6">
            <p className="mb-2 font-medium">Rate this recipe:</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarRating(star)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    star <= starRating 
                      ? 'bg-[#ff6b6b] text-white hover:bg-[#ff5252]' 
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Write your comment:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600"
              rows={4}
              placeholder="Share your thoughts about this recipe..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#ff6b6b] text-white rounded-lg hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)] transition-all"
            >
              Save Comment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommentBox;