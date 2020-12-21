import {
  ReducerDomains,
  LoadStateTypes,
  LoadReducerState,
  LoadActionTypes,
} from '../types';

const initialState: LoadReducerState = {
  loadStatus: {
    [ReducerDomains.AUTH]: null,
  },
  loadErrorStatus: {
    [ReducerDomains.AUTH]: null,
  },
};

export const loadReducer = (state = initialState, action: LoadActionTypes) => {
  function mapActionToDomain(domain: ReducerDomains) {
    switch (action.type) {
      case LoadStateTypes.LOADED:
        return {
          ...state,
          loadStatus: {
            ...state.loadStatus,
            [domain]: LoadStateTypes.LOADED,
          },
        };
      case LoadStateTypes.LOADING:
        return {
          ...state,
          loadStatus: {
            ...state.loadStatus,
            [domain]: LoadStateTypes.LOADING,
          },
          loadErrorStatus: {
            ...state.loadStatus,
            [domain]: null,
          },
        };
      case LoadStateTypes.ERROR:
        return {
          ...state,
          loadStatus: {
            ...state.loadStatus,
            [domain]: LoadStateTypes.ERROR,
          },
          loadErrorStatus: {
            ...state.loadErrorStatus,
            [domain]: action.error,
          },
        };
      default:
        return state;
    }
  }
  return mapActionToDomain(action.domain);
};
