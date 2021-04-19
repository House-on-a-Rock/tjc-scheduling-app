import React from 'react';
import { useQuery } from '../../shared/utilities';

export const ErrorPage = () => {
  const query = useQuery();
  return (
    <>
      You on a wrong page son {query.get('status')}: {query.get('message')}
    </>
  );
};
