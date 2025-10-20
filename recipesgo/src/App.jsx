import React from "react";
import { Routes, Route } from "react-router-dom";
import RecipeDetailPage from "./pages/RecipeDetails";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/Auth" element={<AuthPage />} />
      <Route path="/recipe-details" element={<RecipeDetailPage />} />
    </Routes>
  );
}

export default App;
