import { getAllLocalMembers, getUserRoles } from '../store/apis';
import { NewMembersData, RolesData } from './types';

export const getChurchMembersData = async (key: string, churchId: number) => {
  if (churchId) {
    const { data } = await getAllLocalMembers(churchId);
    const members: NewMembersData[] = await Promise.all(
      data.map(async (member: NewMembersData) => {
        const { data: userRolesData } = await getUserRoles(member.userId);
        return {
          ...member,
          roles: userRolesData.map(({ role }: RolesData) => role.name),
        };
      }),
    );
    return members;
  }
  return [];
};
