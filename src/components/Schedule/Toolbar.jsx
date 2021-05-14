import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import {
  TooltipCreateNewFolder,
  TooltipDeleteIcon,
  TooltipDisabledEditIcon,
  TooltipDisabledPublishIcon,
  TooltipDisabledSaveIcon,
  TooltipCancelIcon,
} from '../shared/TooltipIcons';

const Toolbar = ({
  handleNewServiceClicked,
  destroySchedule,
  isScheduleModified,
  onSaveSchedule,
  isEditMode,
  enableEditMode,
  onSaveEdits,
  onCancelEdits,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.toolbar}>
      <TooltipDisabledPublishIcon
        title="Publish changes"
        disabled={!isScheduleModified}
        // handleClick={() => ()}
      />

      {!isEditMode && (
        <>
          <TooltipDisabledSaveIcon
            title="Save Changes"
            disabled={!isScheduleModified}
            handleClick={onSaveSchedule}
          />
          <TooltipDisabledEditIcon
            title="Edit Template (Changes must be saved before editing)"
            disabled={isScheduleModified}
            handleClick={() => enableEditMode()}
          />
        </>
      )}
      {isEditMode && (
        <>
          <TooltipCancelIcon
            title="Stop editing schedule template, and discard changes"
            onClick={onCancelEdits}
          />
          <TooltipDisabledSaveIcon
            title="Save Template Edits"
            handleClick={() => onSaveEdits()}
          />
          <TooltipCreateNewFolder
            title="Add a new service"
            onClick={handleNewServiceClicked}
          />
          <TooltipDeleteIcon title="Delete schedule" onClick={destroySchedule} />
        </>
      )}
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
  onSaveEdits: PropTypes.func,
  onCancelEdits: PropTypes.func,
};

export default Toolbar;
