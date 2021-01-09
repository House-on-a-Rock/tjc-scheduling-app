import { getAllUserRoles, getTeamsData } from './apis';

export const getUserRoleData = async (churchId: number) => {
  const { data } = await getAllUserRoles(churchId);
  return data;
};

export const getAllTeamsData = async (churchId: number) => {
  const { data } = await getTeamsData(churchId);
  return data;
};
