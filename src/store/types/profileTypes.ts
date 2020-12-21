/** Action Types */
export const LOAD_PROFILE = 'LOAD_PROFILE';

/** Action Payloads */

export interface ProfilePayload {
  churchId: number;
  name: string;
}

/** Action Creators */
interface LoadProfilesAction {
  type: typeof LOAD_PROFILE;
  payload: ProfilePayload;
}

export type ProfileActionTypes = LoadProfilesAction;

export interface ProfileState {
  churchId: number | null;
  name: string;
}
