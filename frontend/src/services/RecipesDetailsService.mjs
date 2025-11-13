import axios from "./Axios.mjs";

export async function rateRecipe(recipeId, stars, comment) {
  return await axios.post("/ratings", {
    recipeId: String(recipeId),
    stars: parseInt(stars),
    comment: comment  
  });
}

export async function favoriteRecipe(recipeId) {
  return await axios.post("/favorites", {
    recipeId: String(recipeId),
  });
}

export async function deleteFavoriteRecipe(recipeId) {
  return await axios.delete(`/favorites/${recipeId}`);
}






