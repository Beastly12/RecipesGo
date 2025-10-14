import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./loginSignup.jsx"

export default function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: "10px", padding: "10px" }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
