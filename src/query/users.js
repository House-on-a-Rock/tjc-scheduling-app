import { getUser } from './apis';

export const getUserData = async (key, userId) => {
  const { data } = await getUser(userId);
  return data;
};
