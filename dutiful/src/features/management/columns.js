import { IsEmailVerified, StatusDropdown } from 'features/management';
import { ActionItems } from 'features/management/components/ActionItems';

// TODO add Access Level (admin)
export const userManagementColumns = [
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Email', accessor: 'email' },
  {
    Header: 'Status',
    accessor: 'active',
    Cell: StatusDropdown,
  },
  {
    Header: 'Email Verified',
    accessor: 'verified',
    Cell: IsEmailVerified,
  },
  {
    Header: 'Action',
    accessor: 'action',
    Cell: ActionItems,
  },
];
