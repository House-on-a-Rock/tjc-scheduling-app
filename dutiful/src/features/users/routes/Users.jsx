import { useAuth } from 'lib/auth';
import { Authorization } from 'lib/authorization';
import { ADMIN } from 'constants/permission';
import { ContentLayout } from 'components/layout';
import { UsersTable } from '..';

export const Users = () => {
  const { user } = useAuth();
  return (
    <ContentLayout title="Users">
      <Authorization allowedRoles={[ADMIN]}>
        <UsersTable churchId={user.churchId} />
      </Authorization>
    </ContentLayout>
  );
};
