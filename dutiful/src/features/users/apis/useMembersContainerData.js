import { useQuery, useMutation, useQueryClient } from 'react-query';
import { addUser, destroyUser, getUsers } from './users';

// import { useQueryConfig, getChurchMembersData } from './shared';

export const useMembersContainerData = (churchId, setState) => {
  const queryClient = useQueryClient();
  const { isLoading: isUsersLoading, data: users } = useQuery(
    ['users'],
    () => getChurchMembersData(churchId),
    useQueryConfig,
  );

  const createUser = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setState('CREATE_USER', 'SUCCESS');
    },
    // onError: (result) => errorHandling(result, setError),
    // onSettled: () => setIsSuccess(''),
  });
  const deleteUser = useMutation(destroyUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('roleData');
      setState('DELETE_USER', 'SUCCESS');
    },
  });

  return [isUsersLoading, users, createUser.mutate, deleteUser.mutate];
};

// import { getAllUsers, getAllRoles, getAllUserRoles } from '../../apis';

export const useQueryConfig = {
  refetchOnWindowFocus: false,
  staleTime: 300000,
  cacheTime: 3000000,
};

async function getMembersData(churchId) {
  const data = await getUsers(churchId);
}
function getChurchMembersData() {}

// export async function getChurchMembersData(churchId) {
//   const { data: users } = await getAllUsers(churchId);
//   const { data: userRoles } = await getAllUserRoles(churchId);
//   const { data: roles } = await getAllRoles(churchId);
//   const usersWithTeammates = [];
//   users.forEach((user) => {
//     const teams = [];
//     userRoles.forEach((ur) => {
//       if (user.userId === ur.user.id) {
//         let teammates = {};
//         roles.forEach((role) => {
//           if (role.id === ur.roleId) teammates = { ...role };
//         });
//         if (teammates.id) teams.push(teammates);
//       }
//     });
//     usersWithTeammates.push({ ...user, teams });
//   });
//   return usersWithTeammates;
// }
