import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Tooltip from '@material-ui/core/Tooltip';

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

interface ScheduleToolbar {
  isScheduleModified: boolean;
  destroySchedule: () => void;
  handleNewServiceClicked: () => void;
  onSaveScheduleChanges: () => void;
  setEditMode: any;
}

// TODO better way to display edit schedule tooltip, mbbe a dialog?

export const ScheduleToolbar = ({
  handleNewServiceClicked,
  destroySchedule,
  isScheduleModified,
  onSaveScheduleChanges,
  setEditMode,
}: ScheduleToolbar) => {
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
        handleClick={() => setEditMode((prev) => !prev)}
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduleToolbar: {
      display: 'flex',
    },
  }),
);
