import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Skull, Loader2 } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';
import { Modal } from 'antd';
import { editUserDetails, handleDeleteUser, getUser } from '../services/UserService.mjs';
import { getUploadUrl } from '../services/ImageUploadService.mjs';
import axios from 'axios';

const { confirm } = Modal;

export default function ProfileSettings() {
  const [profilePic, setProfilePic] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [userId, setUserId] = useState(null);
  const [dpUrl, setDpUrl] = useState('');

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Modal.error({
        title: 'Invalid File Type',
        content: 'Please select an image file.',
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Modal.error({
        title: 'File Too Large',
        content: 'Please select an image smaller than 5MB.',
      });
      return;
    }

    setIsUploadingImage(true);

    const ext = file.type.split('/')[1];
    console.log('File extension:', ext);

    try {
      const uploadres = await getUploadUrl(ext, userId);
      console.log('Upload URL response:', uploadres);

      await axios.put(uploadres.message.uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      console.log('Image uploaded successfully', dpUrl);

      if (!dpUrl) {
        console.log('Updating profile picture URL to:', uploadres.message.imageKey);
        await editUserDetails({ dpUrl: uploadres.message.imageKey });
      }

      setProfilePic(file);

      Modal.success({
        title: 'Success',
        content: 'Profile picture uploaded successfully!',
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      Modal.error({
        title: 'Upload Failed',
        content: 'Failed to upload image. Please try again.',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await editUserDetails({ name, bio, location });
      Modal.success({
        title: 'Success',
        content: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Failed to save changes:', error);
      Modal.error({
        title: 'Save Failed',
        content: 'Failed to save changes. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = async () => {
    setProfilePic(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    await editUserDetails({ dpUrl: '' });
  };

  const handleToggleDarkMode = () => {
    setEnabled(!enabled);
    setTheme(colorTheme);
  };

  const handleDeleteAccount = () => {
    confirm({
      title: 'Are you sure you want to delete your account?',
      content: 'This action cannot be undone. All your data will be permanently deleted.',
      okText: 'Delete Account',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        setIsDeleting(true);
        try {
          console.log('Account deleted');
          await handleDeleteUser();
          window.location.reload();
        } catch (error) {
          console.error('Failed to delete account:', error);
          setIsDeleting(false);
          Modal.error({
            title: 'Deletion Failed',
            content: 'Failed to delete your account. Please try again.',
          });
        }
      },
      onCancel() {
        console.log('Deletion cancelled');
      },
    });
  };

  useEffect(() => {
    if (colorTheme === 'light') {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingProfile(true);
      try {
        const res = await getUser();
        const userData = res;
        if (userData.imageUrl) {
          setProfilePic(userData.dpUrl);
        }
        console.log('Fetched user data:', userData);
        setLocation(userData.location || '');
        setBio(userData.bio || '');
        setName(userData.name || '');
        setUserId(userData.userid || null);
        setProfilePic(userData.dpUrl === '' ? null : userData.dpUrl);
        console.log(userData.dpUrl);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Modal.error({
          title: 'Error',
          content: 'Failed to load profile data. Please refresh the page.',
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoadingProfile) {
    return (
      <div className="bg-[#fafafa] text-[#1a1a1a] min-h-screen font-sans dark:bg-[#0a0a0a] dark:text-[#e5e5e5]">
        <div className="lg:max-w-[900px] py-10 lg:mx-auto px-5 lg:px-10">
          <div className="mb-5">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>

          <div className="bg-white rounded-2xl dark:bg-[#1a1a1a] p-8 mb-6 shadow dark:shadow-lg dark:shadow-black/50">
            <div className="flex flex-col items-center lg:flex-row p-2 gap-5">
              <div className="w-20 h-20 lg:w-40 lg:h-40 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="flex flex-col gap-6 p-6 w-full">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 mb-6 shadow dark:shadow-lg dark:shadow-black/50">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-5 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] text-[#1a1a1a] min-h-screen font-sans dark:bg-[#0a0a0a] dark:text-[#e5e5e5]">
      <div className="lg:max-w-[900px] py-10 lg:mx-auto px-5 lg:px-10">
        <div className="mb-5">
          <Link to={'/'} className="text-xl dark:text-[#e5e5e5]">
            ← Back to Profile
          </Link>
        </div>

        <h1 className="text-4xl font-semibold py-3 dark:text-white">Profile Settings</h1>
        <h2 className="text-slate-400 mb-1 dark:text-slate-500">
          Manage your Information and Preferences
        </h2>

        <div className="bg-white rounded-2xl dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50 p-8 mb-6 shadow">
          <div className="hidden lg:block pl-5 font-semibold lg:text-2xl dark:text-white">
            Profile picture
          </div>
          <div className="flex flex-col items-center lg:flex-row p-2 gap-5">
            {profilePic ? (
              <img
                src={profilePic instanceof File ? URL.createObjectURL(profilePic) : profilePic}
                alt="Profile"
                className="w-20 h-20 lg:w-40 lg:h-40 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 lg:w-40 lg:h-40 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 cursor-pointer hover:scale-105 transition-transform"></div>
            )}
            <div className="flex flex-col gap-6 p-6">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
              />

              <button
                onClick={handleUploadClick}
                disabled={isUploadingImage}
                className={`cursor-pointer p-3 w-full text-xs lg:py-3 lg:px-8 dark:text-slate-300 dark:bg-gray-700 text-slate-600 font-semibold bg-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 ${
                  isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload New Photo'
                )}
              </button>

              <button
                onClick={handleRemovePhoto}
                disabled={!profilePic || isUploadingImage}
                className={`p-3 w-full lg:py-3 text-xs lg:px-8 text-[#ff6b6b] dark:text-[#ff8080] dark:bg-[#ff6b6b]/30 font-semibold bg-[#ff6b6b]/20 rounded-xl transition-opacity ${
                  !profilePic || isUploadingImage
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#ff6b6b]/30 dark:hover:bg-[#ff6b6b]/40'
                }`}
              >
                Remove Photo
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50 rounded-2xl p-8 mb-6 shadow">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Personal Information
          </div>
          <div className="mb-6">
            <label className="dark:text-gray-200">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500"
              placeholder="Enter your name..."
              disabled={isSaving}
            />
          </div>

          <div className="mb-6">
            <label className="dark:text-gray-200">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500"
              placeholder="Tell us about you..."
              disabled={isSaving}
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="dark:text-gray-200">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-800 dark:placeholder-gray-500"
              type="text"
              placeholder="Enter your Location..."
              disabled={isSaving}
            />
          </div>

          <div className="flex gap-2 lg:gap-8 justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={`text-white bg-[#ff6b6b] dark:text-[#ff6b6b] text-sm dark:bg-[#ff6b6b]/30 p-3 rounded-lg flex items-center gap-2 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50 rounded-2xl p-8 mb-6 shadow">
          <div className="text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white">
            Preferences and Privacy
          </div>
          <div className="flex justify-between border-b mb-6 dark:border-gray-700">
            <div>
              <div className="font-semibold dark:text-white">Dark Mode</div>
              <div className="text-[14px] dark:text-slate-400">
                Enable dark theme across the app
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <button
                  onClick={handleToggleDarkMode}
                  className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 ${
                    enabled ? 'bg-[#ff6b6b] dark:bg-[#ff6b6b]/70' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl dark:bg-[#1a1a1a] p-8 mb-6 shadow dark:shadow-lg dark:shadow-black/50">
          <div className="flex gap-3 flex-col border-2 rounded-2xl py-10 px-5 transition-all border-[#ff6b6b] dark:border-[#ff5252] bg-[#fff5f5] dark:bg-[#2a0a0a]">
            <div className="text-xl font-semibold text-[#ff6b6b] flex gap-2 dark:text-[#ff8080]">
              <Skull />
              Danger Zone
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Once you delete your account, there is no going back, please be certain
            </div>
            <div>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`py-3 px-8 cursor-pointer dark:text-[#ff8080] dark:bg-[#ff6b6b]/30 text-[#ff6b6b] font-semibold bg-[#ff6b6b]/20 rounded-xl transition-opacity flex items-center gap-2 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting Account...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
