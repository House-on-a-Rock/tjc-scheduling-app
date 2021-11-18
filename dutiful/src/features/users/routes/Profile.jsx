import { ContentLayout } from 'components/layout';
import { useAuth } from 'lib/auth';
import { UserProfileDetails } from '..';

export const Profile = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <ContentLayout title="Profile">
      <UserProfileDetails />
    </ContentLayout>
  );
};
