import axios from './Axios.mjs';
import { fetchAuthSession } from 'aws-amplify/auth';

export async function rateRecipe(recipeId, stars, comment = null) {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  const rating = {
    recipeId: String(recipeId),
    stars: parseInt(stars),
  };

  if (comment) {
    rating.comment = comment;
  }

  return await axios.post('/ratings', rating, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function favoriteRecipe(recipeId) {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();
  console.log('FAV recipe id:', recipeId);
  return await axios.post(
    '/favorites',
    { recipeId: String(recipeId) },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function deleteFavoriteRecipe(recipeId) {
  return await axios.delete(`/favorites/${recipeId}`);
}

export async function editRatingRecipe(recipeId, stars, comment = null) {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();
  const rating = {
    recipeId: String(recipeId),
    stars: parseInt(stars),
  };

  if (comment) {
    rating.comment = comment;
  }

  return await axios.post('/ratings', rating, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function favoriteCheck(recipeId) {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    console.log('recipe id:', recipeId);

    const { data } = await axios.get('/favorites', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('favorites data:', data);

    const recipeLiked = data.message.some((fav) => String(fav.id) === String(recipeId));
    console.log('favorites status:', recipeLiked);
    return recipeLiked;
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return false;
  }
}

export async function deleteRatingRecipe(recipeId) {
  return await axios.delete(`/ratings/${recipeId}`);
}

export async function getRatingsbyId(recipeId) {
  return await axios.get(`/ratings/${recipeId}`);
}

export async function getAllRatings({ recipeId, last } = {}) {
  if (!recipeId) throw new Error('recipeId is required');

  const params = {};
  if (last) params.last = last;

  return await axios.get(`/ratings/${recipeId}`, { params });
}

export async function getRecipebyId({ recipeId }) {
  return await axios.get(`/recipes/${recipeId}`);
}
