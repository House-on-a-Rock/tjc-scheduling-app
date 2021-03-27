import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';

import { MembersContainer } from './MembersContainer';

import { getChurchMembersData } from '../../query';
import { addUser, destroyUser } from '../../query/apis';
import { NewUserData } from '../../shared/types';

interface MembersProps {
  churchId: number;
}

export const Members = ({ churchId }: MembersProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState(null);

  const [isSuccess, setIsSuccess] = useState<string>('');
  const users = useQuery(['users', churchId], () => getChurchMembersData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
  });

  const createUser = useMutation<AxiosResponse<any>, AxiosError, NewUserData, unknown>(
    addUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setIsSuccess('NewUser');
      },
      onError: (result) => errorHandling(result, setError),
      onSettled: () => setIsSuccess(''),
    },
  );
  const deleteUser = useMutation(destroyUser, {
    onSuccess: () => queryClient.invalidateQueries('roleData'),
  });

  // const emailForAvailabilities =

  useEffect(() => {
    if (users.isSuccess) setError(null);
    if (users.isError) setError(users.error);
    if (users.data) setData({ ...data, users: users.data });

    if (users.isLoading !== isLoading) setIsLoading(users.isLoading);
  }, [users]);

  return (
    <MembersContainer
      state={{ data, isLoading, error, isSuccess }}
      addUser={(newInfo: NewUserData) => createUser.mutate({ ...newInfo, churchId })}
      removeUser={(info: any) => deleteUser.mutate(info)}
    />
  );
};

function errorHandling(result: AxiosError, setError) {
  setError({
    status: result.response.status,
    message: result.response.statusText,
  });
}
