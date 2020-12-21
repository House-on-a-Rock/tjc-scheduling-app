import { useState } from 'react';

interface ValidatedFieldState<T> {
  valid: boolean;
  message: string;
  value: T;
}

const createFieldState: <T>(arg: T) => ValidatedFieldState<T> = (value) => ({
  value: value,
  message: '',
  valid: true,
});

export function useValidatedField<T>(initialState: T, message: string) {
  const [inputState, setInputState] = useState<ValidatedFieldState<T>>(
    createFieldState<T>(initialState),
  );

  const setInputStateError = (condition: boolean) => {
    if (condition)
      setInputState({
        ...inputState,
        valid: false,
        message: message,
      });
  };
  const resetInputState = () =>
    setInputState({ ...inputState, valid: true, message: '' });

  return [inputState, setInputState, setInputStateError, resetInputState] as const;
}
