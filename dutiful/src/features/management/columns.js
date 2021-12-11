import { TableCell } from 'components/table';
import { IsEmailVerified, StatusDropdown } from 'features/management';
import { ActionItems } from 'features/management/components/ActionItems';
import { cloneElement } from 'react';
import _ from 'lodash';

const WithTableCell =
  (Component) =>
  ({ role, key, ...props }) => {
    return (
      <TableCell role={role} key={key}>
        {_.isFunction(Component) ? cloneElement(<Component />, { ...props }) : Component}
      </TableCell>
    );
  };

const DefaultCell = ({ role, key, ...props }) => {
  console.log(props.cell.getCellProps());
  return <TableCell {...props.cell.getCellProps()}>{props.cell.value}</TableCell>;
};

// TODO add Access Level (admin)
export const userManagementColumns = [
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Email', accessor: 'email' },
  // {
  //   Header: 'Status',
  //   accessor: 'active',
  //   Cell: WithTableCell(StatusDropdown),
  // },
  // {
  //   Header: 'Email Verified',
  //   accessor: 'verified',
  //   Cell: WithTableCell(IsEmailVerified),
  // },
  // {
  //   Header: 'Action',
  //   accessor: 'action',
  //   Cell: WithTableCell(ActionItems),
  // },
];
// .map((initialColumn) => {
//   let column = { ...initialColumn };
//   if (!column.Cell) column.Cell = DefaultCell;
//   return column;
// });

// TODO Roles Management
// Allowing your users to assign roles for other users is not just basic, it’s critical. The most basic approach would be to assign each user a specific role within your SaaS application. There are also several more advanced approaches for handling assignment of roles for your users:

// Multiple Roles — Some apps allow you to add multiple roles for users. In case those roles include a set of permissions, then the user would be allowed to perform any of the actions that exist in any or all of the roles assigned to them.
// Custom Roles — More advanced, enterprise-facing apps will allow admins of customers, to create their own custom role sets and even override existing, pre-defined roles.
// Specific Access — Some apps let you choose the specific module/section access for each user. This can be achieved by taking a pure role-based access approach as well, although it sometimes allows for higher granularity on the allowed actions within the product.

// TODO  Constructing a Role Statement

export const teamManagementColumns = [
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Team Lead', accessor: 'teamLead' },
];

export function constructEmptyRow(columns) {
  const row = {};
  columns.forEach(({ Header, accessor }) => {
    row[Header] = '';
  });
  return [row];
}
