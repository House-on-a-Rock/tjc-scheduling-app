import { FormControl, NativeSelect } from '@material-ui/core';

export const Select = ({ value, children, onSelect, input, ...props }) => {
  return (
    <FormControl {...props}>
      <NativeSelect value={value} onChange={onSelect} variant="standard" input={input}>
        {children}
      </NativeSelect>
    </FormControl>
  );
};
