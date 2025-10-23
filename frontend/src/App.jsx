import React from "react";
import { Routes, Route } from "react-router-dom";
import RecipeFeed from "./views/RecipesFeed";
import CreateRecipePage from "./views/CreateRecipePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RecipeFeed />} />
      <Route path="/createRecipe" element={<CreateRecipePage/>}/>
    </Routes>
  );
}

export default App;
