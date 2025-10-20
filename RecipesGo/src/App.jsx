import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./loginSignup.jsx"
import Profile from "./profile.jsx"

export default function App() {
  return (
    <div>
      <nav>
        <div className="logo"><h2>Prepify</h2></div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
