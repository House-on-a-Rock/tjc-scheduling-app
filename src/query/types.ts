import { MemberStateData } from '../store/types';

export type IRole = {
  name: string;
};
export interface RolesData {
  roleId: number;
  role: IRole;
}
export interface NewMembersData extends MemberStateData {
  roles: string[];
}
