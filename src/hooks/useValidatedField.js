import { useState } from 'react';

const createFieldState = (value) => ({
  value: value,
  message: '',
  valid: true,
});

export function useValidatedField(initialState, message) {
  const [inputState, setInputState] = useState(createFieldState(initialState));

  const setInputStateError = (condition) => {
    if (condition)
      setInputState({
        ...inputState,
        valid: false,
        message: message,
      });
  };
  const resetInputState = () =>
    setInputState({ ...inputState, valid: true, message: '' });

  return [inputState, setInputState, setInputStateError, resetInputState];
}
