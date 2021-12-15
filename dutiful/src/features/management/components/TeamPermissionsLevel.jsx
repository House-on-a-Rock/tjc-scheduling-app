import { TableCell } from 'components/table';

export const TeamPermissionsLevel = ({ value, ...props }) => {
  const val = value ? 'Team Lead' : 'Member';
  return <TableCell {...props}>{val}</TableCell>;
};
