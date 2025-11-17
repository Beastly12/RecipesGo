import axios from './Axios.mjs';

export async function getDashBoardData() {
  try {
    const res = await axios.get('/dashboard');
    return res.data;
  } catch (error) {
    console.log('Error fetching dashboard data', error);
    throw error;
  }
}
