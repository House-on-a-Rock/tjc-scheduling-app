import { AuthActionTypes, LOGIN, LOGOUT, AuthState, AUTH_LOADING } from '../types';

const initialState: AuthState = {
  isLoggedIn: false,
  loading: false,
  response: {
    status: 0,
    message: '',
  },
};

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
      };
    case AUTH_LOADING:
      const { loading, response } = action.payload;
      return { ...state, loading, response };

    default:
      return state;
  }
};
