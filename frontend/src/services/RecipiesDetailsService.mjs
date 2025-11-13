import axios from "./Axios.mjs";

export async function rateRecipe(recipeId, stars, comment) {
  return await axios.post("/ratings", {
    recipeId: String(recipeId),
    stars: parseInt(stars),
    comment: comment  
  });
}






