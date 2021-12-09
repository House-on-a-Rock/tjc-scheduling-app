import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import { Textfield } from '.';
import { forwardRef } from 'react';
import { useToggle } from 'hooks/useToggle';

export const Password = forwardRef(({ ...props }, ref) => {
  const [visible, setVisible] = useToggle(false);

  return (
    <Textfield
      required
      id="password"
      name="password"
      label="Password"
      type={visible ? 'text' : 'password'}
      fullWidth
      InputProps={{
        endAdornment: (
          <VisiblePasswordAdornment visible={visible} handleVisible={setVisible} />
        ),
      }}
      ref={ref}
      {...props}
    />
  );
});

const VisiblePasswordAdornment = ({ visible, handleVisible }) => (
  <InputAdornment position="end">
    <IconButton
      aria-label="toggle password visibility"
      onClick={handleVisible}
      onMouseDown={(event) => event.preventDefault()}
    >
      {visible ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  </InputAdornment>
);
