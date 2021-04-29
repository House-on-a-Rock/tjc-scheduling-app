import { useQuery, useMutation, useQueryClient } from 'react-query';

import { useQueryConfig, getChurchMembersData } from './shared';
import { addUser, destroyUser } from '../../apis';

const useMembersContainerData = (churchId, setState) => {
  const queryClient = useQueryClient();
  const { isLoading: isUsersLoading, data: users } = useQuery(
    ['users'],
    () => getChurchMembersData(churchId),
    useQueryConfig,
  );

  const createUser = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setState('NEW_USER', 'SUCCESS');
    },
    // onError: (result) => errorHandling(result, setError),
    // onSettled: () => setIsSuccess(''),
  });
  const deleteUser = useMutation(destroyUser, {
    onSuccess: () => queryClient.invalidateQueries('roleData'),
  });

  return [isUsersLoading, users, createUser, deleteUser];
};
export default useMembersContainerData;
