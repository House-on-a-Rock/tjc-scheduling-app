// action types
export const LOAD_MEMBERS = 'LOAD_MEMBERS';
export const ADD_MEMBER = 'ADD_MEMBER';
export const DELETE_MEMBERS = 'DELETE_MEMBERS';
export const LOAD_USER = 'LOAD_USER';

// action payloads

interface ChurchAttribute {
  name: string;
}
export interface MemberStateData {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  ChurchId?: number;
  church: ChurchAttribute;
  disabled: boolean;
  roles: string[];
}

// action creators
interface LoadMembersAction {
  type: typeof LOAD_MEMBERS;
  payload: MemberStateData[];
  church: string;
}

interface AddMemberAction {
  type: typeof ADD_MEMBER;
  payload: MemberStateData;
}

interface DeleteMemberAction {
  type: typeof DELETE_MEMBERS;
  payload: number;
}

interface LoadUserDataAction {
  type: typeof LOAD_USER;
  payload: MemberStateData;
}

export type MemberActionTypes =
  | LoadMembersAction
  | AddMemberAction
  | DeleteMemberAction
  | LoadUserDataAction;

export interface MembersState {
  members: MemberStateData[];
  selectedUser: MemberStateData;
  localChurch: string;
}
