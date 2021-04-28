import { useQuery, useMutation } from 'react-query';

import { useQueryConfig, getChurchMembersData } from './shared';
import { addUser, destroyUser } from '../../apis';

const useMembersContainerData = (churchId) => {
  const { isLoading: isUsersLoading, data: users } = useQuery(
    ['users'],
    () => getChurchMembersData(churchId),
    useQueryConfig,
  );

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

  return [isUsersLoading, users, createUser, deleteUser];
};
export default useMembersContainerData;
