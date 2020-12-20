import React from 'react';
import { Select } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Tooltip } from './Tooltip';

import { ValidatedFieldState } from '../../shared/types/models';

interface IValidatedSelectProps {
  className?: string;
  input: ValidatedFieldState<number>;
  onChange: (arg: ValidatedFieldState<number>) => void;
  toolTip: { id: string; text: string };
  children: any[];
  [x: string]: any;
}

export const ValidatedSelect = ({
  className,
  input,
  onChange,
  toolTip,
  children,
  ...restProps
}: IValidatedSelectProps) => {
  return (
    <FormControl className={className} error={!input.valid}>
      <InputLabel>Team</InputLabel>
      <Select
        className={className}
        value={input.value}
        required={true}
        variant="outlined"
        onChange={(e: React.ChangeEvent<{ name: string; value: number }>) =>
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
