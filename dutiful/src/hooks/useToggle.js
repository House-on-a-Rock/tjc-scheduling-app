import { useState } from 'react';

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);

  function handleToggle(bool) {
    if (bool === undefined || bool.target) setState(!state);
    else setState(bool);
  }

  return [state, handleToggle];
};
