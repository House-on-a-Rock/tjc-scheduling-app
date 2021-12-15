import { TableCell } from 'components/table';

export const TeamPermissionsLevel = ({ value }) => {
  const val = value ? 'Team Lead' : 'Member';
  return <TableCell>{val}</TableCell>;
};
