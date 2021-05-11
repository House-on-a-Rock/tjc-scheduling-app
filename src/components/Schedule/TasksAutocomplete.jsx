import React from 'react';
import PropTypes from 'prop-types';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme';

import { cellStatus, extractTeammateIds, getUserOptionLabel } from './utilities';

/*
  Props explanation

  dataId:             userId/roleId assigned
  extractOptionId?:   function to extract ids from dataset, needed for mat ui autocomplete
  dataSet:            dataset from which to display autocomplete options, contains all the other info
  onChange:           onChangeHandler
  dataContext:        contains info like rowIndex/serviceIndex/roleId, used by onChange callback.
  getOptionLabel:     string that shows in autocomplete
  renderOption?:      basically just adds an icon to indicate which was the previously saved option, may be used to add more stuff

*/

const TasksAutocomplete = React.memo((props) => {
  const {
    dataId,
    options,
    status,
    dataContext,
    onChange,
    renderOption,
    isEditMode,
  } = props;
  const classes = useStyles();
  const [initialId, setInitialId] = React.useState(dataId);

  React.useEffect(() => {
    if (status === cellStatus.SYNCED) setInitialId(dataId);
  }, [status]);

  return (
    <TableCell className={classes[status]}>
      <Autocomplete
        options={extractTeammateIds(options)}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              style: { fontSize: 14 },
            }}
          />
        )}
        getOptionLabel={(option) => getUserOptionLabel(option, options)}
        getOptionDisabled={(option) => option === dataId}
        renderOption={(option) =>
          renderOption(getUserOptionLabel(option, options), option === initialId)
        }
        value={dataId}
        onChange={(event, newValue) => onChange(dataContext, newValue)}
        disableClearable
        fullWidth
        clearOnBlur
        openOnFocus
        forcePopupIcon={false}
        autoHighlight={true}
        disabled={isEditMode}
      />
    </TableCell>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.dataId === nextProps.dataId &&
    prevProps.isEditMode === nextProps.isEditMode &&
    prevProps.status === nextProps.status &&
    prevProps.options === nextProps.options
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    synced: {
      color: typographyTheme.common.color,
      textAlign: 'center',
      '&:focus': {
        outline: 'none',
      },
      'user-select': 'none',
      padding: '1px 0px 2px 0px',
      height: 20,
      width: 100,
    },
    modified: {
      color: typographyTheme.common.color,
      textAlign: 'center',
      '&:focus': {
        outline: 'none',
      },
      'user-select': 'none',
      padding: '1px 0px 2px 0px',
      height: 20,
      width: 100,
      backgroundColor: 'rgb(125, 226, 226)',
    },
    warning: {
      color: typographyTheme.common.color,
      textAlign: 'center',
      '&:focus': {
        outline: 'none',
      },
      'user-select': 'none',
      padding: '1px 0px 2px 0px',
      height: 20,
      width: 100,
      backgroundColor: 'rgb(250, 20, 20)',
    },
    input: {
      fontSize: 50,
    },
  }),
);

TasksAutocomplete.propTypes = {
  dataId: PropTypes.number,
  options: PropTypes.array,
  roleId: PropTypes.number,
  status: PropTypes.string,
  dataContext: PropTypes.object,
  isSaved: PropTypes.bool,
  onChange: PropTypes.func,
  renderOption: PropTypes.func,
  isEditMode: PropTypes.bool,
  isScheduleModified: PropTypes.bool,
};

export default TasksAutocomplete;
