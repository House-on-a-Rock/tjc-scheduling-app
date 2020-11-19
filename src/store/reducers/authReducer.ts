import { AuthActionTypes, LOGIN, LOGOUT, AuthState } from '../types';

const initialState: AuthState = {
  isLoggedIn: false,
  isValidLogin: null,
};

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        isValidLogin: true,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        isValidLogin: null,
      };

    default:
      return state;
  }
};
