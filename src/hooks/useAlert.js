import { useState } from 'react';
import { AlertInterface } from '../shared/types';

// this became unnecessary for now, but i'll leave it in case
export const useAlert = () => {
  const [alert, setAlert] = useState<AlertInterface>(); // we will change this to HttpResponseStatus (also in models) later
  return [alert, setAlert] as const;
};
