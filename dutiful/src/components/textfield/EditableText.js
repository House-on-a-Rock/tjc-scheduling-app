import { InputBase } from '@material-ui/core';

export const EditableText = ({ ...props }) => {
  return <InputBase defaultValue="Naked input" inputProps={{ 'aria-label': 'naked' }} />;
};
