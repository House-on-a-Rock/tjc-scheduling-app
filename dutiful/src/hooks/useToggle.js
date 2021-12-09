import { useState } from 'react';

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);

  function handleToggle(bool) {
    if (bool !== undefined) setState(bool);
    else setState(!state);
  }

  return [state, handleToggle];
};
