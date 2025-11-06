import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import RecipeDetailPage from "./views/RecipeDetails";
import AuthPage from "./views/AuthPage";
import RecipeFeed from "./views/RecipesFeed";
import CreateRecipePage from "./views/CreateRecipePage";
import Profile from "./views/ProfilePage";
import ProfileSettings from "./views/ProfileSettings";
import DashBoard from "./views/DashBoard";
import { Amplify } from 'aws-amplify';




 Amplify.configure({Auth:{
    Cognito:{
      userPoolId: "eu-west-2_raKAsXGjN",
      userPoolClientId: "6pio1e475d7i7vjqf2obl6novf",
    }
  }});


export default function App() {
  return (
    <Routes>
      <Route path="/recipe-details" element={<RecipeDetailPage />} />
      <Route path="/Auth" element={<AuthPage />} />
      <Route path="/" element={<RecipeFeed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/Settings" element={<ProfileSettings />} />
      <Route path="/createRecipe" element={<CreateRecipePage />} />
      <Route path="/Dashboard" element={<DashBoard />} />
    </Routes>
  );
}
