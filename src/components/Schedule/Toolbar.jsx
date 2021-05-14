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

const Toolbar = ({
  handleNewServiceClicked,
  destroySchedule,
  isScheduleModified,
  onSaveSchedule,
  isEditMode,
  enableEditMode,
  exitEditingClick,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.toolbar}>
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
        handleClick={() => onSaveSchedule()}
      >
        <SaveIcon />
      </TooltipForDisabledButton>
      {!isEditMode && (
        <TooltipForDisabledButton
          title="Edit Template (Changes must be saved before editing)"
          disabled={isScheduleModified}
          handleClick={() => enableEditMode()}
        >
          <EditIcon />
        </TooltipForDisabledButton>
      )}
      {isEditMode && (
        <TooltipForDisabledButton
          title="Save Template Edits"
          handleClick={() => exitEditingClick()}
        >
          <SaveIcon />
        </TooltipForDisabledButton>
      )}
      <TooltipForDisabledButton
        title="Publish changes"
        disabled={!isScheduleModified}
        // handleClick={() => ()}
      >
        <PublishIcon />
      </TooltipForDisabledButton>
    </div>
  );
};
// would like it to stay showing even when scrolling down
const useStyles = makeStyles(() =>
  createStyles({
    toolbar: {
      display: 'flex',
      // position: 'fixed',
    },
  }),
);

Toolbar.propTypes = {
  isScheduleModified: PropTypes.bool,
  handleNewServiceClicked: PropTypes.func,
  destroySchedule: PropTypes.func,
  onSaveSchedule: PropTypes.func,
  isEditMode: PropTypes.bool,
  enableEditMode: PropTypes.func,
  exitEditingClick: PropTypes.func,
};
TooltipForDisabledButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
};

export default Toolbar;
