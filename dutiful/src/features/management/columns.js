import { IsEmailVerified, StatusDropdown } from 'features/management';
import { ActionItems } from 'features/management/components/ActionItems';
import { withCells } from 'lib/react-table/helpers';

// TODO add Access Level (admin)
const userManagementColumns = withCells([
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
    Cell: IsEmailVerified, // Not an editable cell
  },
  {
    Header: 'Action',
    accessor: 'action',
    Cell: ActionItems, // Not an editable cell
  },
]);

const teamManagementColumns = withCells([
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Team Lead', accessor: 'teamLead' },
]);

export { teamManagementColumns, userManagementColumns };

// TODO Roles Management
// Allowing your users to assign roles for other users is not just basic, it’s critical. The most basic approach would be to assign each user a specific role within your SaaS application. There are also several more advanced approaches for handling assignment of roles for your users:

// Multiple Roles — Some apps allow you to add multiple roles for users. In case those roles include a set of permissions, then the user would be allowed to perform any of the actions that exist in any or all of the roles assigned to them.
// Custom Roles — More advanced, enterprise-facing apps will allow admins of customers, to create their own custom role sets and even override existing, pre-defined roles.
// Specific Access — Some apps let you choose the specific module/section access for each user. This can be achieved by taking a pure role-based access approach as well, although it sometimes allows for higher granularity on the allowed actions within the product.

// TODO  Constructing a Role Statement
