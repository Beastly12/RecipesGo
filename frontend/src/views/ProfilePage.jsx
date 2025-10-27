import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import RecipesList from "../components/RecipeList";

var rData = [
  {
    key: 0,
    title: "Chocolate Chip Cookies",
    author: "Lis Park",
    likes: 183,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600",
  },
  {
    key: 1,
    title: "Creamy Mushroom Pasta",
    author: "Sara Chen",
    likes: 189,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
  {
    key: 2,
    title: "Fresh Garden Salad Bowl",
    author: "Sara Chen",
    likes: 103,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
  {
    key: 3,
    title: "Creamy Mushroom Pasta",
    author: "Sara Chen",
    likes: 203,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
];

const profileBio = [
  {
    id: 1,
    name: "Emma Rossi",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Home chef & food enthusiast sharing my favorite comfort food recipes. Passionate about Italian cuisine and creating simple, delicious meals for everyday cooking.",
    recipesCount: 24,
    totalLikes: 1420,
  },
];

export default function Profile() {
  const profile = profileBio[0];

  return (
    <div className="min-h-screen  bg-[#fafafa] m-4 text-[#1a1a1a]">
      <div className="flex m-4 p-3 space-x-3">
        <ArrowLeft className="cursor-pointer" />
        <button className=" text-xl font-medium cursor-pointer hover:underline md:font-light">
          Back to home
        </button>
      </div>

      <div className="max-w-[900px] my-[40px] mx-[auto] px-[40px]">
        <div className="w-full bg-gray-50 border-b-2 border-b-gray-500 rounded-2xl mb-6 flex space-x-2">
          <div className="mt-8 mb-8 p-8 mr-5">
            <img
              className=" rounded-full border-1 object-cover w-50 h-50 sm:w-120 sm:h-42 md:w-50 md:h-50"
              src={profile.img}
              alt="Profile Image"
            />
          </div>

          <div className="space-y-4 m-6 p-2">
            <h3 className="font-bold text-3xl">{profile.name}</h3>
            <p className="text-[16px] sm:text-[12px] md:text-[16px] md:break-all">
              {profile.bio}
            </p>

            <div className="flex items-center space-x-4 mt-8">
              <div>
                <p className="font-bold text-[#1a1a1a]">Recipes</p>
                <p>{profile.recipesCount}</p>
              </div>
              <div>
                <p className="font-bold">Total Likes</p>
                <p>{profile.totalLikes}</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <div className="m-10 mt-20">
        <RecipesList recipes={rData} />
      </div>
    </div>
  );
}
