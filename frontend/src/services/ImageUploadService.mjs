import axios from './Axios.mjs';

export async function getUploadUrl(ext) {
  const res = await axios.get(`/upload-url?ext=${ext}`);
  return res.data;
}
