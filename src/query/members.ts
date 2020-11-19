import { getAllLocalMembers, getUserRoles } from '../store/apis';
import { INewMembersData, IRolesData } from './types';

export const getChurchMembersData = async (key: string, churchId: number) => {
  if (churchId) {
    const { data } = await getAllLocalMembers(churchId);
    const members: INewMembersData[] = await Promise.all(
      data.map(async (member: INewMembersData) => {
        const { data } = await getUserRoles(member.userId);
        return { ...member, roles: data.map(({ role }: IRolesData) => role.name) };
      }),
    );
    return members;
  }
  return [];
};
