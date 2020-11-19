/** Action Types */
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const AUTH_ERROR = 'AUTH_ERROR';
export const REMEMBER_ME = 'REMEMBER_ME';
export const FORGET_ME = 'FORGET_ME';

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

interface RememberAction {
  type: typeof REMEMBER_ME;
  payload: EmailMemory;
}
interface ForgetAction {
  type: typeof FORGET_ME;
}

export type AuthActionTypes = LoginAction | LogoutAction | RememberAction | ForgetAction;

/** Reducer State */
export interface AuthState {
  isLoggedIn: boolean;
  isValidLogin: boolean | null;
}
