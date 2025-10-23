import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import RecipeDetailPage from "./views/RecipeDetails";
import Profile from "./profile.jsx";
import LoginSignUp from "./loginSignup.jsx"




export default function App() {
  return (
    <div>
      <nav>
        <div className="logo"><h2>Prepify</h2></div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/recipe-details">DETIALS</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipe-details" element={<RecipeDetailPage />} />
      </Routes>
    </div>
  );
}