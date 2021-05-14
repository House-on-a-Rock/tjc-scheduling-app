import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import {
  TooltipCreateNewFolder,
  TooltipDeleteIcon,
  TooltipDisabledEditIcon,
  TooltipDisabledPublishIcon,
  TooltipDisabledSaveIcon,
} from '../shared/TooltipIcons';

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
      <TooltipDisabledPublishIcon
        title="Publish changes"
        disabled={!isScheduleModified}
        // handleClick={() => ()}
      />
      <TooltipDisabledSaveIcon
        title="Save Changes"
        disabled={!isScheduleModified}
        handleClick={onSaveSchedule}
      />
      {!isEditMode && (
        <TooltipDisabledEditIcon
          title="Edit Template (Changes must be saved before editing)"
          disabled={isScheduleModified}
          handleClick={() => enableEditMode()}
        />
      )}
      {isEditMode && (
        <>
          <TooltipDeleteIcon title="Delete schedule" onClick={destroySchedule} />
          <TooltipCreateNewFolder
            title="Add a new service"
            onClick={handleNewServiceClicked}
          />
          <TooltipDisabledSaveIcon
            title="Save Template Edits"
            handleClick={() => exitEditingClick()}
          />
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
