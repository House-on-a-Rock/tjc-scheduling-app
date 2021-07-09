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
  TooltipDisabledResetIcon,
  TooltipDisabledSaveTemplateIcon,
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
  onResetClick,
  onSaveTemplate,
  onPublishSchedule,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.toolbar}>
      <TooltipDisabledPublishIcon
        title="Publish changes"
        disabled={isScheduleModified}
        handleClick={onPublishSchedule}
      />
      <TooltipDisabledSaveTemplateIcon
        title="Save schedule as template"
        handleClick={onSaveTemplate}
        disabled={isEditMode}
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
            handleClick={enableEditMode}
          />
          <TooltipDisabledResetIcon
            title="Reset and discard changes"
            disabled={!isScheduleModified}
            handleClick={onResetClick}
          />
        </>
      )}
      {isEditMode && (
        <>
          <TooltipCancelIcon
            title="Stop editing schedule template, and discard changes"
            handleClick={onCancelEdits}
          />
          <TooltipDisabledSaveIcon
            title="Save Template Edits"
            handleClick={onSaveEdits}
          />
          <TooltipCreateNewFolder
            title="Add a new service"
            handleClick={handleNewServiceClicked}
          />
          <TooltipDeleteIcon title="Delete schedule" handleClick={destroySchedule} />
        </>
      )}
    </div>
  );
};
// would like it to stay showing even when scrolling down
const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    // position: 'fixed',
  },
});

Toolbar.propTypes = {
  isScheduleModified: PropTypes.bool,
  handleNewServiceClicked: PropTypes.func,
  destroySchedule: PropTypes.func,
  onSaveSchedule: PropTypes.func,
  isEditMode: PropTypes.bool,
  enableEditMode: PropTypes.func,
  onSaveEdits: PropTypes.func,
  onCancelEdits: PropTypes.func,
  onResetClick: PropTypes.func,
  onSaveTemplate: PropTypes.func,
  onPublishSchedule: PropTypes.func,
};

export default Toolbar;
