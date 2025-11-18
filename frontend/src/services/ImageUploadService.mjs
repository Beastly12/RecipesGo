import axios from './Axios.mjs';

export async function getUploadUrl(ext, id) {
  try {
    const res = await axios.get('/upload-url', { params: { ext, id } });
    return res.data;
  } catch (err) {
    console.error('Failed to get upload URL:', err);
    throw err;
  }
}
