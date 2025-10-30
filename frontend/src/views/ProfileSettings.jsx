import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Skull } from "lucide-react";

export default function ProfileSettings() {
  const [profilePic, setProfilePic] = useState(null);
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="bg-[#fafafa] text-[#1a1a1a] min-h-screen font-sans dark:bg-[#0a0a0a] dark:text-[#e5e5e5]  ">
      <div className="lg:max-w-[900px] py-[40px] lg:mx-[auto] px-[20px] lg:px-[40px]  ">
        <div className="mb-5">
          <Link to={"/"} className="text-xl dark:text-[#e5e5e5]  ">
            ← Back to Profile
          </Link>
        </div>

        <h1 className=" text-4xl font-semibold py-3 dark:text-white">Profile Settings</h1>
        <h2 className=" text-slate-400 mb-1 dark:text-slate-500  ">
          Manage your Information and Preferences
        </h2>

        <div className=" bg-white rounded-2xl dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50 p-8 mb-6 shadow">
          <div className="  hidden lg:block  pl-5 font-semibold lg:text-2xl dark:text-white">
            Profile picture
          </div>
          <div className=" flex  flex-col items-center lg:flex-row p-2  gap-5">
            {profilePic ? (
              <img alt="Profile" />
            ) : (
              <div className=" w-20 h-20 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 cursor-pointer hover:scale-105 transition-transform"></div>
            )}
            <div className="flex flex-col gap-6 p-6">
              <button className=" p-3 w-full text-xs lg:py-3 lg:px-8 dark:text-slate-300 dark:bg-gray-700   text-slate-600 font-semibold bg-gray-200 rounded-xl ">
                Upload New Photo
              </button>
              <button className=" p-3 w-full lg:py-3 text-xs lg:px-8 text-[#ff6b6b] dark:text-[#ff8080] dark:bg-[#ff6b6b]/30  font-semibold bg-[#ff6b6b]/20 rounded-xl ">
                Remove Photo
              </button>
            </div>
          </div>
        </div>

        <div className=" bg-white dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50 rounded-2xl p-8 mb-6 shadow">
          <div className=" text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white ">
            Personal Information
          </div>
          <div className=" mb-6">
            <label className="dark:text-gray-200">Full Name</label>
            <input type="text"  className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500" placeholder="Enter your name..." />
          </div>

          <div className=" mb-6">
            <label className="dark:text-gray-200">Email</label>
            <input type="text"  className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500" placeholder="Enter your Email..." />
          </div>

          <div className="mb-6">
            <label className="dark:text-gray-200"> Bio</label>
            <textarea  className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-600 dark:placeholder-gray-500" placeholder="Tell us about you..."></textarea>
          </div>

          <div className=" mb-6">
            <label className="dark:text-gray-200">Location</label>
            <input   className="dark:bg-[#0a0a0a] dark:text-white dark:border-gray-800 dark:placeholder-gray-500" type="text" placeholder="Enter your Location..." />
          </div>

          <div className=" flex gap-2 lg:gap-8 justify-end ">
            <button className=" rounded-lg bg-gray-200 dark:bg-gray-700 p-3 text-sm lg:py-3 lg:px-5">
              Cancel
            </button>
            <button className=" text-white bg-[#ff6b6b] dark:text-[#ff6b6b] text-sm  dark:bg-[#ff6b6b]/30  p-1 rounded-lg ">
              Save Changes
            </button>
          </div>
        </div>

        <div className=" bg-white dark:bg-[#1a1a1a] dark:shadow-lg dark:shadow-black/50 rounded-2xl p-8 mb-6 shadow">
          <div className=" text-[20px] font-bold mb-5 text-[#1a1a1a] dark:text-white ">
            Preferences and Privacy
          </div>
          <div className="flex justify-between border-b-1 mb-6 dark:border-gray-700">
            <div>
              <div className="font-semibold dark:text-white">Dark Mode</div>
              <div className="text-[14px] dark:text-slate-400">
                Enanble dark theme across the app
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 ${
                    enabled ? "bg-[#ff6b6b] dark:bg-[#ff6b6b]/70" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      enabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between border-b-1 mb-6 dark:border-gray-700">
            <div>
              <div className="font-semibold dark:text-white">Private Profile</div>
              <div className="text-[14px] dark:text-slate-400">
                only followers can see your recipes
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 ${
                    enabled ? "bg-[#ff6b6b] dark:bg-[#ff6b6b]/70" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      enabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between border-b-1 mb-6 dark:border-gray-700">
            <div>
              <div className="font-semibold dark:text-white">Show Activity</div>
              <div className="text-[14px] dark:text-slate-400">
                    Let others see your likes and comments 
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 ${
                    enabled ? "bg-[#ff6b6b] dark:bg-[#ff6b6b]/70" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      enabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-white rounded-2xl dark:bg-[#1a1a1a] p-8 mb-6 shadow dark:shadow-lg dark:shadow-black/50">
          <div
            className=" flex gap-3 flex-col  border-2  rounded-2xl py-[40px] px-[20px] 
                      transition-all  border-[#ff6b6b]  dark:border-[#ff5252] bg-[#fff5f5] dark:bg-[#2a0a0a] "
          >
            <div className=" text-xl font-semibold text-[#ff6b6b] flex  gap-2 dark:text-[#ff8080] ">
              {" "}
              <Skull />
              Danger Zone
            </div>
            <div className=" text-slate-500 dark:text-slate-400">
              once you delete your account, there is no going back, please be
              certain{" "}
            </div>
            <div>
              <button className="py-3 px-8 cursor-pointer dark:text-[#ff8080] dark:bg-[#ff6b6b]/30  text-[#ff6b6b] font-semibold bg-[#ff6b6b]/20 rounded-xl">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
