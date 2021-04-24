import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';

const TooltipForDisabledButton = ({ title, disabled, handleClick, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip title={title} open={open}>
      <div
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <IconButton disabled={disabled} onClick={() => handleClick()}>
          {children}
        </IconButton>
      </div>
    </Tooltip>
  );
};

const ScheduleToolbar = ({
  handleNewServiceClicked,
  destroySchedule,
  isScheduleModified,
  onSaveScheduleChanges,
  setEditMode,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.scheduleToolbar}>
      <Tooltip title="Add A New Service">
        <IconButton onClick={() => handleNewServiceClicked()}>
          <CreateNewFolderIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete schedule">
        <IconButton onClick={() => destroySchedule()}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <TooltipForDisabledButton
        title="Save Changes"
        disabled={!isScheduleModified}
        handleClick={() => onSaveScheduleChanges()}
      >
        <SaveIcon />
      </TooltipForDisabledButton>
      <TooltipForDisabledButton
        title="Edit Template (Changes must be saved before editing)"
        disabled={isScheduleModified}
        handleClick={() => setEditMode()}
      >
        <EditIcon />
      </TooltipForDisabledButton>
      <TooltipForDisabledButton
        title="Publish changes"
        disabled={!isScheduleModified}
        handleClick={() => onSaveScheduleChanges()}
      >
        <PublishIcon />
      </TooltipForDisabledButton>
    </div>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    scheduleToolbar: {
      display: 'flex',
    },
  }),
);

ScheduleToolbar.propTypes = {
  isScheduleModified: PropTypes.bool,
  handleNewServiceClicked: PropTypes.func,
  destroySchedule: PropTypes.func,
  onSaveScheduleChanges: PropTypes.func,
};
TooltipForDisabledButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
};

export default ScheduleToolbar;
