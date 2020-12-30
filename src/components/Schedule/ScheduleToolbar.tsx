import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Tooltip from '@material-ui/core/Tooltip';

const TooltipForDisabledButton = ({
  title,
  state,
  setState,
  disabled,
  handleClick,
  children,
}) => {
  return (
    <Tooltip title={title} open={state}>
      <div
        onMouseOver={() => setState(true)}
        onMouseOut={() => setState(false)}
        onFocus={() => setState(true)}
        onBlur={() => setState(false)}
      >
        <IconButton disabled={disabled} onClick={() => handleClick()}>
          {children}
        </IconButton>
      </div>
    </Tooltip>
  );
};

export const ScheduleToolbar = ({
  handleNewServiceClicked,
  destroySchedule,
  isScheduleModified,
  onSaveScheduleChanges,
}: any) => {
  const classes = useStyles();
  const [isSaveIconOpen, setIsSaveIconOpen] = useState(false);
  const [isPublishIconOpen, setIsPublishIconOpen] = useState(false);
  return (
    <div className={classes.iconBar}>
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
        state={isSaveIconOpen}
        setState={setIsSaveIconOpen}
        disabled={!isScheduleModified}
        handleClick={() => onSaveScheduleChanges()}
      >
        <SaveIcon />
      </TooltipForDisabledButton>
      <TooltipForDisabledButton
        title="Publish changes"
        state={isPublishIconOpen}
        setState={setIsPublishIconOpen}
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
    iconBar: {
      display: 'flex',
    },
  }),
);
