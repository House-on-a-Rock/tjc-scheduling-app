import { useState } from 'react';

const createFieldState = (value) => ({
  value: value,
  message: '',
  valid: true,
});

function useValidatedField(initialState, message) {
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
  const setInput = (input) => setInputState(createFieldState(input.value));

  return [inputState, setInput, setInputStateError, resetInputState];
}

export default useValidatedField;
