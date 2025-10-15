import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./loginSignup.jsx"

export default function App() {
  return (
    <div>
      <nav>
        <div className="logo"><h2>Prepify</h2></div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
