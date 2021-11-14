import PropTypes from 'prop-types';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

import { ToolbarButton } from '../shared';

const MembersToolbar = ({ deletable, handleAdd, handleDelete, handleRequestAvail }) => {
  const classes = useStyles();
  return (
    <div className={classes.iconBar}>
      <ToolbarButton
        title="Add a new user"
        icon={<PersonAddIcon />}
        handleClick={handleAdd}
      />
      <ToolbarButton
        title="Delete user"
        icon={<DeleteIcon />}
        handleClick={handleDelete}
        disabled={!deletable}
      />
      <ToolbarButton
        title="Request availabilities"
        icon={<EventAvailableIcon />}
        handleClick={handleRequestAvail}
      />
    </div>
  );
};
const useStyles = makeStyles(() =>
  createStyles({
    iconBar: {
      display: 'flex',
    },
  }),
);

MembersToolbar.propTypes = {
  deletable: PropTypes.bool,
  handleAdd: PropTypes.func,
  handleDelete: PropTypes.func,
  handleRequestAvail: PropTypes.func,
};

export default MembersToolbar;
