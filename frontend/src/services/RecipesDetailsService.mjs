import axios from "./Axios.mjs";

export async function rateRecipe(recipeId, stars, comment = null) {
  const rating = {
    recipeId: String(recipeId),
    stars: parseInt(stars),
  };

  if (comment) {
    rating.comment = comment;
  }

  return await axios.post("/ratings", rating);
}


export async function favoriteRecipe(recipeId) {
  return await axios.post("/favorites", {
    recipeId: String(recipeId),
  });
}

export async function deleteFavoriteRecipe(recipeId) {
  return await axios.delete(`/favorites/${recipeId}`);
}

export async function editRatingRecipe(recipeId, stars, comment = null) {
  const rating = {
    recipeId: String(recipeId),
    stars: parseInt(stars),
  };

  if (comment) {
    rating.comment = comment;
  }

  return await axios.post("/ratings", rating);
}

export async function deleteRatingRecipe(recipeId) {
  return await axios.delete(`/ratings/${recipeId}`);
}

export async function getRatingsbyId(recipeId){
  return await axios.get(`/ratings/${recipeId}`); 
}

export async function getAllRatings({ recipeId, last } = {}) {
  if (!recipeId) throw new Error("recipeId is required");

  const params = {};
  if (last) params.last = last;

  return await axios.get(`/ratings/${recipeId}`, { params });
}

export async function getDetailsbyId(recipeId){
  return await axios.get(`/recipes/${recipeId}`); 
}



