import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../../store';

// TypedUseSelectorHook deprecated, try createSelectorHook
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
