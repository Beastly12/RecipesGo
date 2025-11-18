import { deleteUser } from 'aws-amplify/auth';
import axios from './Axios.mjs';

export async function handleDeleteUser() {
  try {
    await deleteUser();
  } catch (error) {
    console.log(error);
  }
}

export async function editUserDetails({ name, bio, location, dpUrl }) {
  const params = {};

  if (dpUrl) {
    params.dpUrl = dpUrl;
  }

  if (bio) {
    params.bio = bio;
  }

  if (location) {
    params.location = location;
  }

  if (name) {
    params.name = name;
  }

  const res = await axios.put(`/users`, params);
  return res.data;
}


export async function getUserDetails() {
  const res = await axios.get(`/users`);
  return res.data.message;
}