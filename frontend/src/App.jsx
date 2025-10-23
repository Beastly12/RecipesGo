import React from "react";
import { Routes, Route } from "react-router-dom";
import RecipeDetailPage from "./views/RecipeDetails";
import AuthPage from "./views/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/recipe-details" element={<RecipeDetailPage />} />
      <Route path="/Auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
