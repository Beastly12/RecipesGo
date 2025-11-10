export async function editUserDetails({name,bio,location,imageUrl}) {
  const res = await axios.put(`/user`,{name,bio,location,imageUrl});
  return res.data;
}
