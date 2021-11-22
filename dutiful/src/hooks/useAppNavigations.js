import {
  EventNote,
  Assignment,
  AccountCircle,
  RecentActors,
  Home,
  Mail,
  Notifications,
} from '@material-ui/icons';

import { useAuthorization } from 'lib/authorization';
import { useAuth } from 'lib/auth';
import { ADMIN, HYMN_LEADER } from 'constants/permission';

export const useAppNavigations = () => {
  const { logout } = useAuth();
  const { checkAccess } = useAuthorization();
  const sidebar = [
    { title: 'Unhidden', icon: <Home />, type: 'title' },
    {
      title: 'Scheduling Tool',
      url: '/schedule',
      icon: <EventNote />,
      label: 'schedule',
    },
    {
      title: 'User Management',
      label: 'manage',
      url: '/manage',
      icon: <RecentActors />,
      children: [
        checkAccess({ allowedRoles: [ADMIN] }) && {
          title: 'Users',
          label: 'users',
          url: '/users',
        },
        checkAccess({ allowedRoles: [HYMN_LEADER] }) && {
          title: 'Teams',
          label: 'teams',
          url: '/teams',
        },
        { title: 'Permissions', label: 'permission', url: '/permission', disabled: true },
      ].filter(Boolean),
    },
    { title: 'Templates', label: 'templates', url: '/templates', icon: <Assignment /> },
  ];
  const header = [
    {
      key: 'mail',
      label: 'show 4 new mails',
      icon: <Mail />,
      disabled: true,
    },
    {
      key: 'notification',
      label: 'show new notifications',
      icon: <Notifications />,
      type: 'menu',
      list: [
        { text: 'Notification 1', type: 'link', url: '/notifications' },
        { text: 'Notification 2', type: 'link', url: '/notifications' },
        { text: 'Notification 3', type: 'link', url: '/notifications' },
        { text: 'Notification 4', type: 'link', url: '/notifications' },
      ],
      disabled: true,
      tooltip: 'Notifications',
    },
    {
      key: 'account',
      label: 'account settings',
      icon: <AccountCircle />,
      type: 'menu',
      list: [
        { text: 'Profile', type: 'link', url: '/profile' },
        { text: 'My Account', type: 'link', url: '/settings' },
        { text: 'Logout', onClick: () => logout() },
      ],
      tooltip: 'Account',
    },
  ];
  return [header, sidebar];
};
