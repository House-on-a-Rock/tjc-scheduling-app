import { Link } from 'react-router-dom';
import { Button } from '.';

export const LinkButton = ({ ...props }) => {
  return <Button component={Link} {...props} />;
};
