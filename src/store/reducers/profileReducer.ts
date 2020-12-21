import { LOAD_PROFILE, ProfileActionTypes, ProfileState } from '../types/profileTypes';

const initialState: ProfileState = {
  churchId: null,
  name: '',
};

export const profileReducer = (
  state = initialState,
  action: ProfileActionTypes,
): ProfileState => {
  switch (action.type) {
    case LOAD_PROFILE:
      return { ...state, churchId: action.payload.churchId, name: action.payload.name };
    default:
      return state;
  }
};
