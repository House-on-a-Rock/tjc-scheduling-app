import { getUser } from '../store/apis';

export const getUserData = async (key: string, userId: number) => {
  const { data } = await getUser(userId);
  return data;
};
