import axios from 'axios';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  AuthActionTypes,
  LOGIN,
  LOGOUT,
  REMEMBER_ME,
  EmailMemory,
  FORGET_ME,
} from '../types';
import history from '../../history';
import { AuthStateActions } from './loadActions';
import {
  recoverEmail,
  checkResetToken,
  authenticateLogin,
  sendNewPassword,
} from '../apis';
import { errorDataExtractor } from '../../shared/utilities';

export const login = (): AuthActionTypes => ({ type: LOGIN });
export const logout = (): AuthActionTypes => ({ type: LOGOUT });
export const rememberMe = (remember: EmailMemory): AuthActionTypes => ({
  type: REMEMBER_ME,
  payload: remember,
});
export const forgetMe = (): AuthActionTypes => ({ type: FORGET_ME });

/* Thunk */
export const onValidated = (): ThunkAction<any, any, any, Action> => (dispatch) => {
  dispatch(login());
  dispatch(AuthStateActions.Loaded());
  history.push('/');
};

export const checkCredentials = (
  email: string,
  password: string,
): ThunkAction<any, any, any, Action> => {
  return async (dispatch) => {
    try {
      const res = await authenticateLogin(email, password);
      const { data, status, statusText } = res;
      console.log('123123123', res, status, res.headers);
      dispatch(AuthStateActions.Loading());
      localStorage.setItem('access_token', data.access_token);
      axios.defaults.headers.commonauthorization = data.access_token;
      // if (status === 200) window.location = res.headers.Location;
      if (status === 200) dispatch(onValidated());
      else dispatch(AuthStateActions.Error({ status, message: statusText }));
    } catch (error) {
      const errorData = errorDataExtractor(error);
      dispatch(AuthStateActions.Error(errorData));
    }
  };
};

export const validateResetToken = (token: string): ThunkAction<any, any, any, Action> => {
  return async (dispatch) => {
    dispatch(AuthStateActions.Loading());
    try {
      const { status, statusText } = await checkResetToken(token);
      if (status === 200) dispatch(AuthStateActions.Loaded());
      else dispatch(AuthStateActions.Error({ status, message: statusText }));
    } catch (error) {
      const errorData = errorDataExtractor(error);
      dispatch(AuthStateActions.Error(errorData));
    }
  };
};

export const sendAuthEmail = (
  email: string,
): ThunkAction<any, any, any, Action> => async (dispatch) => {
  dispatch(AuthStateActions.Loading());
  try {
    const { status, statusText } = await recoverEmail(email);
    if (status === 200) dispatch(AuthStateActions.Loaded());
    else dispatch(AuthStateActions.Error({ status, message: statusText }));
  } catch (error) {
    const errorData = errorDataExtractor(error);
    dispatch(AuthStateActions.Error(errorData));
  }
};

export const resetPassword = (
  token: string,
  newPassword: string,
): ThunkAction<any, any, any, Action> => async (dispatch) => {
  dispatch(AuthStateActions.Loading());
  try {
    const { status, statusText } = await sendNewPassword(token, newPassword);
    if (status === 201) dispatch(AuthStateActions.Loaded());
    else dispatch(AuthStateActions.Error({ status, message: statusText }));
  } catch (error) {
    const errorData = errorDataExtractor(error);
    dispatch(AuthStateActions.Error(errorData));
  }
};
