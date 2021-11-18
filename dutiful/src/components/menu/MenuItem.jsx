import { Link } from 'react-router-dom';
import MuiMenuItem from '@material-ui/core/MenuItem';

export const MenuItem = ({ type, url, text, ...props }) => {
  let computeProps = {};
  if (type === 'link') {
    computeProps['component'] = Link;
    computeProps['to'] = url;
  }

  return (
    <MuiMenuItem {...computeProps} {...props}>
      {text}
    </MuiMenuItem>
  );
};
