import axios from './Axios.mjs';

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
  console.log({
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
  const response = await axios.post('/recipes', {
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
  return response.data;
}

export async function deleteRecipe(recipeId) {
  return await axios.delete(`/recipes/${recipeId}`);
}

export async function getAllRecipes({ category, last } = {}) {
  const params = {};

  if (category) params.category = category;
  if (last) params.last = last;

  return await axios.get('/recipes', { params });
}

export async function editRecipe(recipeId, data) {
  return await axios.put(`/recipes/${recipeId}`, data);
}

export async function getRecipebyId(recipeId) {
  return await axios.get(`/recipes/${recipeId}`);
}

export async function getRecipesByUser(userId, last) {
  const params = { by: userId };

  if (last) params.last = last;
  return await axios.get('/recipes', { params });
}
