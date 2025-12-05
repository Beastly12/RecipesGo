import axios from './Axios.mjs';

export async function getUserProfile(userId) {
  try {
    const res = await axios.get(`users/${userId}/profile`);
    return res.data;
  } catch (error) {
    console.log('Error fetching user profile', error);
    throw error;
  }
}

export async function getUserRecipes(userId) {
  try {
    const res = await axios.get(`users/${userId}/recipes`);
    return res.data;
  } catch (error) {
    console.log('Error fetching user recipes', error);
    throw error;
  }
}
