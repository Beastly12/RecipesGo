import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import RecipesList from "./components/RecipeList";

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
    author: " Sara Chen",
    likes: 189,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
  {
    key: 2,
    title: "Fresh Garden Salad Bowl",
    author: " Sara Chen",
    likes: 103,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
  {
    key: 3,
    title: "Creamy Mushroom Pasta",
    author: " Sara Chen",
    likes: 203,
    profilePic: "",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
];

const image = [
  { imag: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" },
];

export default function Profile() {
  return (
    <div className="min-h-screen  bg-[#fafafa] m-4 text-[#1a1a1a]">
      <div className="flex m-4 p-3 space-x-3">
        <ArrowLeft className="cursor-pointer" />
        <button className=" text-xl font-medium cursor-pointer hover:underline md:font-light">
          Back to home
        </button>
      </div>

      <div className="w-full bg-gray-50 shadow-[0_12px_24px_rgba(0,0,0,0.12)] rounded-2xl mb-6 flex flex-col">
        <div className="mt-8 mb-8">
          <img
            className=" rounded-full border object-cover w-50 h-50"
            src={image}
            alt="Profile Image"
          />
        </div>

        <div></div>
      </div>
      <RecipesList recipes={rData} />
    </div>
  );
}
