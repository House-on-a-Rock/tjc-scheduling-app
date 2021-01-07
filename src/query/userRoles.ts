import { getAllUserRoles } from './apis';

export const getUserRoleData = async (churchId: number) => {
  const { data } = await getAllUserRoles(churchId);
  return data;
};
