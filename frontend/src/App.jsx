import React from "react";
import "./App.css"
import { Routes, Route } from "react-router-dom";
import RecipeDetailPage from "./views/RecipeDetails";
import AuthPage from "./views/AuthPage";
import RecipeFeed from "./views/RecipesFeed";
import CreateRecipePage from "./views/CreateRecipePage";
import Profile from "./views/ProfilePage";
import ProfileSettings from "./views/ProfileSettings";

export default function App() {
  return (
    <Routes>
      <Route path="/recipe-details" element={<RecipeDetailPage />} />
      <Route path="/Auth" element={<AuthPage />} />
      <Route path="/" element={<RecipeFeed />} />
      <Route path="/profile" element={<Profile />} />

      {/* <Route path="/" element={<h1>Home Page</h1>} /> */}
      {/* <Route path="/login" element={<LoginSignUp />} /> */}
      <Route path="/Settings" element={<ProfileSettings />} />
      {/* <Route path="/recipe-details" element={<RecipeDetailPage />} /> */}
      <Route path="/createRecipe" element={<CreateRecipePage />} />
    </Routes>
  );
}
