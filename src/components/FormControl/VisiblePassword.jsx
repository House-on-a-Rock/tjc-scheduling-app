import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


export const VisiblePassword = ({ data, handleVisible }) => (
  <InputAdornment position="end">
    <IconButton
      aria-label="toggle password visibility"
      onClick={() => handleVisible(!data.visible)}
      onMouseDown={(event) => event.preventDefault()}
    >
      {data.visible ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  </InputAdornment>
);
