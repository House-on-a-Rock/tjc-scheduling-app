import axios from 'axios';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AuthActionTypes, LOGIN, LOGOUT, AUTH_LOADING } from '../types';
import history from '../../history';
import { AuthStateActions } from './loadActions';
import {
  recoverEmail,
  checkResetToken,
  authenticateLogin,
  sendNewPassword,
} from '../apis';
import { errorDataExtractor, setLocalStorageState } from '../../shared/utilities';
import { LoadingPayload } from '../../shared/types';

export const login = (): AuthActionTypes => ({ type: LOGIN });
export const logout = (): AuthActionTypes => ({ type: LOGOUT });

export const authLoading = (payload: LoadingPayload): AuthActionTypes => ({
  type: AUTH_LOADING,
  payload,
});

/* Thunk */
export const onValidated = (): ThunkAction<any, any, any, Action> => (dispatch) => {
  dispatch(authLoading({ loading: false, response: { status: 0, message: '' } }));
  dispatch(login());
  history.push('/');
};

export const checkCredentials = (
  email: string,
  password: string,
): ThunkAction<any, any, any, Action> => {
  return async (dispatch) => {
    try {
      dispatch(authLoading({ loading: true, response: { status: 0, message: '' } }));
      const res = await authenticateLogin(email, password);
      const { data, status, statusText } = res;
      const { token } = data;
      if (token) {
        axios.defaults.headers.common.authorization = token;
        setLocalStorageState('access_token', token);
        dispatch(onValidated());
      }
    } catch (error) {
      const errorData = errorDataExtractor(error);
      console.error(errorData);
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
