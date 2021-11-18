import { ADMIN } from 'constants/permission';
import { Authorization } from 'lib/authorization';

export const Users = () => {
  return (
    <Authorization allowedRoles={[ADMIN]}>
      <div>Users</div>
    </Authorization>
  );
};

// TODO guests
