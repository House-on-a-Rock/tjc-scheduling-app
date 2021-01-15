export interface BackendTeamsData {
  role: string;
  roleId: string;
  members: TeamData[];
}
export interface TeamData {
  id: string;
  userId: string;
  name: string;
}

export interface MembersData {
  id: string;
  userId: string;
  name: string;
}

export interface TeamState {
  [key: string]: {
    members: TeamData[];
    roleId: string;
  };
}

export interface DraggedItem {
  member: MembersData;
  source: string;
}

export interface UserRoleData {
  userId: string;
  roleId: string;
}
