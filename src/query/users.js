import { getUser } from './apis';

export const getUserData = async (key: string, userId: string) => {
  const { data } = await getUser(userId);
  return data;
};
