import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { PasswordState } from '../../shared/types/models';

interface VisibilePasswordProp {
  data: PasswordState;
  handleVisible: (arg0: boolean) => void;
}

export const VisiblePassword = ({ data, handleVisible }: VisibilePasswordProp) => (
  <InputAdornment position="end">
    <IconButton
      aria-label="toggle password visibility"
      onClick={() => handleVisible(!data.visible)}
      onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()}
    >
      {data.visible ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  </InputAdornment>
);
