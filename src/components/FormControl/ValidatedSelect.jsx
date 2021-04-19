import React from 'react';
import { Select } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Tooltip } from '../shared/Tooltip';



export const ValidatedSelect = ({
  className,
  input,
  onChange,
  toolTip,
  children,
  label,
  ...restProps
}) => {
  return (
    <FormControl className={className} error={!input.valid}>
      <InputLabel>{label}</InputLabel>
      <Select
        className={className}
        value={input.value}
        required
        variant="outlined"
        onChange={(e) =>
          onChange({ valid: true, message: '', value: e.target.value })
        }
        {...restProps}
      >
        {children}
      </Select>
      <FormHelperText style={{ color: 'red' }}>{input.message}</FormHelperText>
      <Tooltip id={toolTip.id} text={toolTip.text} />
    </FormControl>
  );
};
