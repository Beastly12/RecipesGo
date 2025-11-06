import axios from "./Axios.mjs";

export async function createRecipeService({
  name,
  imageUrl,
  description,
  category,
  ingredients,
  instructions,
  preparationTime,
  isPublic,
  difficulty,
}) {
  await axios.post("/recipes", {
    name,
    imageUrl,
    description,
    category,
    ingredients,
    instructions,
    preparationTime,
    isPublic,
    difficulty,
  });
}

export async function deleteRecipe(recipeId) {
  return await axios.delete(`/recipes/${recipeId}`);
}

export async function getAllRecipes({ category, last } = {}) {
  const params = {};

  if (category) params.category = category;
  if (last) params.last = last;

  return await axios.get("/recipes", { params });
}

export async function editRecipe(recipeId, data) {
  return await axios.put(`/recipes/${recipeId}`, data);
}
