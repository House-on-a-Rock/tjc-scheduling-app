import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import MembersMain from './MembersMain';
import { getChurchMembersData } from '../../query';
import { addUser, destroyUser } from '../../query/apis';

const MembersContainer = ({ churchId }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  const [isSuccess, setIsSuccess] = useState('');
  const users = useQuery(['users', churchId], () => getChurchMembersData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
  });

  const createUser = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setIsSuccess('NewUser');
    },
    onError: (result) => errorHandling(result, setError),
    onSettled: () => setIsSuccess(''),
  });
  const deleteUser = useMutation(destroyUser, {
    onSuccess: () => queryClient.invalidateQueries('roleData'),
  });

  useEffect(() => {
    if (users.isSuccess) setError(null);
    if (users.isError) setError(users.error);
    if (users.data) setData({ ...data, users: users.data });

    if (users.isLoading !== isLoading) setIsLoading(users.isLoading);
  }, [users]);

  return (
    <MembersMain
      state={{ data, isLoading, error, isSuccess }}
      addUser={(newInfo) => createUser.mutate({ ...newInfo, churchId })}
      removeUser={(info) => deleteUser.mutate(info)}
      // addSchedule={(newInfo: NewScheduleData) =>
      //   createSchedule.mutate({ ...newInfo, churchId })
      // }
      // removeSchedule={(info: DeleteScheduleData) => deleteSchedule.mutate(info)}
    />
  );
};

function errorHandling(result, setError) {
  setError({
    status: result.response.status,
    message: result.response.statusText,
  });
}

MembersContainer.propTypes = {
  churchId: PropTypes.number,
};

export default MembersContainer;
