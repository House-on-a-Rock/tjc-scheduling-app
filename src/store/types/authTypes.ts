import { LoadingState, LoadingPayload } from '../../shared/types';

/** Action Types */
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const AUTH_LOADING = 'AUTH_LOADING';

/** Action Payloads */
export interface EmailMemory {
  email: string;
}

/** Action Creators */
interface LoginAction {
  type: typeof LOGIN;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

interface AuthLoadingAction {
  type: typeof AUTH_LOADING;
  payload: LoadingPayload;
}

export type AuthActionTypes = LoginAction | LogoutAction | AuthLoadingAction;

/** Reducer State */
export interface AuthState extends LoadingState {
  isLoggedIn: boolean;
}
