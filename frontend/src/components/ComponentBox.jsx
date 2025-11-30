<<<<<<< HEAD
import React from 'react';
import Modal from 'react-modal';
import { useModal } from '../context/CustomModalContext';
import CustomInput from './CustomInput';

Modal.setAppElement('#root');
=======
import React, { useState } from 'react';
import { Modal, Popconfirm } from 'antd';
import { useAuthContext } from '../context/AuthContext';
>>>>>>> real/main

const CommentBox = ({
  totalComments,
  visibleComments,
  hasMore,
  handleViewMore,
<<<<<<< HEAD
  handlePopupClosed,
=======
>>>>>>> real/main
  comment,
  setComment,
  starRating,
  setStarRating,
  handleComment,
<<<<<<< HEAD
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
=======
  handleRatings,
  handleDelete,
  recipeId,
  lastKey,
  loading: commentsLoading,
  isDeleting,
}) => {

  const { user: loggedInUser, loading: authLoading } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = authLoading || commentsLoading;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setStarRating(0);
    setComment('');
    setIsModalOpen(false);

  };

  const handleSave = async () => {
    await handleComment();
    setStarRating(0);
    setComment('');
    setIsModalOpen(false);

  };

  if (isLoading || isDeleting) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] mt-14 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_24px_rgba(255,255,255,0.05)] mb-8 transition-colors duration-500">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-10">
          <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-44 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>

        {/* Comment Skeletons */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-gray-50 dark:bg-[#2a2a2a] p-3 rounded-lg mb-3 border-b border-gray-300 dark:border-gray-700 transition-colors duration-500"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-[#1e1e1e] mt-14 p-7 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_24px_rgba(255,255,255,0.05)] mb-8 transition-colors duration-500">
        <div className="flex justify-between items-center mb-10">
          <h2 className="font-bold text-3xl text-gray-800 dark:text-gray-100">
            Comments ({totalComments.length})
          </h2>
         {loggedInUser?.userId&& <button
            onClick={showModal}
            className="px-4 py-2 bg-[#ff6b6b] text-white rounded-xl hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)]"
          >
            {totalComments.some(c => c.authorId === loggedInUser?.userId) ? "EDIT YOUR COMMENT" : "DROP A COMMENT!"}
          </button>}
        </div>

        {totalComments?.slice(0, visibleComments).map((comment) => (
          <div
            key={comment.key}
            className="flex items-start gap-3 bg-gray-50 dark:bg-[#2a2a2a] p-3 rounded-lg mb-3 border-b border-gray-300 dark:border-gray-700 transition-colors duration-500"
          >
            <img src={comment.profilePic} alt={comment.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100">{comment.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{comment.posted}</p>
                </div>
                {comment.authorId === loggedInUser?.userId && (
                  <Popconfirm
                    title="Delete Comment"
                    description="Are you sure you want to delete this comment?"
                    onConfirm={() => handleDelete(comment.key)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ 
                      danger: true,
                      className: 'bg-red-500 hover:bg-red-600'
                    }}
                  >
                    <button
                      className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete comment"
                    >
                      Delete
                    </button>
                  </Popconfirm>
                )}
              </div>
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
>>>>>>> real/main
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
    </>
  );
};

export default CommentBox;