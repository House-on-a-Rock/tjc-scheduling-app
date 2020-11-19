import { LOAD_PROFILE, ProfilePayload } from '../types/profileTypes';

export const loadProfile = (payload: ProfilePayload) => ({
  type: LOAD_PROFILE,
  payload,
});
