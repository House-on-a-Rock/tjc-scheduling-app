import { MemberStateData } from '../store/types';

export type IRole = {
  name: string;
};
export interface IRolesData {
  roleId: number;
  role: IRole;
}
export interface INewMembersData extends MemberStateData {
  roles: string[];
}
