/* eslint-disable no-shadow */
import { HttpError } from '../../shared/types/models';

/** Action Types */
export const LOADED = 'LOADED';
export const LOADING = 'LOADING';
export const ERROR = 'ERROR';
export const ERROR_HANDLED = 'ERROR_HANDLED';

export enum ReducerDomains {
  AUTH = 'AUTH',
}
/** Action Payloads */
interface LoadedAction {
  type: typeof LOADED;
  domain: ReducerDomains;
}

interface LoadingAction {
  type: typeof LOADING;
  domain: ReducerDomains;
}

interface ErrorAction {
  type: typeof ERROR;
  domain: ReducerDomains;
  error: HttpError;
}

interface ErrorHandledAction {
  type: typeof ERROR_HANDLED;
  domain: ReducerDomains;
}

export type LoadActionTypes =
  | LoadedAction
  | LoadingAction
  | ErrorAction
  | ErrorHandledAction;

/** Reducer State */
export interface LoadStatusType {
  [ReducerDomains.AUTH]: string | null;
}

export interface LoadErrorType {
  [ReducerDomains.AUTH]: HttpError | null;
}

export interface LoadReducerState {
  loadStatus: LoadStatusType;
  loadErrorStatus: LoadErrorType;
}

export enum LoadStateTypes {
  LOADED = 'LOADED',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  ERROR_HANDLED = 'ERROR_HANDLED',
}
