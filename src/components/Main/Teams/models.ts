export interface BackendTeamsData {
  role: string;
  members: TeamData[];
}
export interface TeamData {
  id: string;
  name: string;
}

export interface MembersData {
  id: string;
  name: string;
}

export interface TeamState {
  [key: string]: TeamData[];
}

export interface DraggedItem {
  member: MembersData;
  source: string;
}
