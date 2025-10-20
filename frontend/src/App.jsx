import React from "react";
import { Routes, Route } from "react-router-dom";
import RecipeDetailPage from "./pages/RecipeDetails";

function App() {
  return (
    <Routes>
      <Route path="/recipe-details" element={<RecipeDetailPage />} />
    </Routes>
  );
}

export default App;
