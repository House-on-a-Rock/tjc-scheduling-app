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

  const { mutate: createUser } = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setState('CREATE_USER', 'SUCCESS');
    },
    // onError: (result) => errorHandling(result, setError),
    // onSettled: () => setIsSuccess(''),
  });
  const { mutate: deleteUser } = useMutation(destroyUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('roleData');
      setState('DELETE_USER', 'SUCCESS');
    },
  });

  return [isUsersLoading, users, createUser, deleteUser];
};
export default useMembersContainerData;
