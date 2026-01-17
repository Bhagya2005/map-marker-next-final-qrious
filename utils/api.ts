export async function getUserPinsFromDB(userId: string) {
  const res = await fetch(`/api/pins?userId=${userId}`);
  return await res.json();
}

export async function getUserCategoriesFromDB(userId: string) {
  const res = await fetch(`/api/categories?userId=${userId}`);
  return await res.json();
}
