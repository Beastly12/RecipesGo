import React from "react";
import { Routes, Route } from "react-router-dom";
import RecipeFeed from "./views/RecipesFeed";
import CreateRecipePage from "./views/CreateRecipePage";




export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RecipeFeed />} />
      <Route path="/createRecipe" element={<CreateRecipePage/>}/>
    </Routes>
  );
}

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipe-details" element={<RecipeDetailPage />} />
      </Routes>
    </div>
  );
}