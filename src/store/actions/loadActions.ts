import { ReducerDomains, LoadStateTypes } from '../types';
import { HttpResponseStatus } from '../../shared/types/models';

export const AuthStateActions = mapLoadStateActions(ReducerDomains.AUTH)();

// this may be moved to a more appropriate location?
function mapLoadStateActions(domain: ReducerDomains) {
  return () => {
    return {
      Loaded: () => ({ domain, type: LoadStateTypes.LOADED }),
      Loading: () => ({ domain, type: LoadStateTypes.LOADING }),
      Error: (error: HttpResponseStatus) => ({
        domain,
        type: LoadStateTypes.ERROR,
        error: error,
      }),
    };
  };
}
