import { getUser } from './apis';

// unused
export const getUserData = async (key, userId) => {
  const { data } = await getUser(userId);
  return data;
};
