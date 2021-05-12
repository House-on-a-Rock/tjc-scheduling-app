import React, { useState } from 'react';
import PropTypes from 'prop-types';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme';

import { extractRoleIds, getRoleOptionLabel } from './utilities';

/*
  Props explanation

  dataId:             userId/roleId assigned
  extractOptionId?:   function to extract ids from dataset
  options:            dataset from which to display autocomplete options, contains all the other info
  onChange:           onChangeHandler
  dataContext:        contains info like rowIndex/serviceIndex/roleId, used by onChange callback.
  renderOption?:      basically just adds an icon to indicate which was the previously saved option, may be used to add more stuff
  isSaved;   if initialData should update to the latest dataId
*/

const DutyAutocomplete = React.memo(
  ({ dataId, options, dataContext, onChange, renderOption, isEditMode }) => {
    const classes = useStyles();

    const [isCellModified, setIsCellModified] = useState(false);
    const [initialData] = useState(dataId);

    function onCellModify(isChanged, newValue) {
      setIsCellModified(isChanged);
      onChange(dataContext, newValue);
    }

    // maybe use disabled tag on autocomplete, but will need to override its css so its not super greyed out
    return !isEditMode ? (
      <TableCell>{getRoleOptionLabel(dataId, options)}</TableCell>
    ) : (
      <TableCell className={isCellModified ? classes.modified : classes.cell}>
        <Autocomplete
          id="combo-box"
          options={extractRoleIds(options)}
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                style: { fontSize: 14 },
              }}
            />
          )}
          getOptionLabel={(option) => getRoleOptionLabel(option, options)}
          getOptionDisabled={(option) => option === dataId}
          renderOption={(option) =>
            renderOption(getRoleOptionLabel(option, options), option === initialData)
          }
          value={dataId < 0 ? 1 : dataId}
          onChange={(event, newValue) => onCellModify(newValue !== initialData, newValue)}
          disableClearable
          fullWidth
          clearOnBlur
          openOnFocus
          forcePopupIcon={false}
          autoHighlight={true}
          // disabled={!isEditMode}
        />
      </TableCell>
    );
  },
  arePropsEqual,
);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.dataId === nextProps.dataId &&
    prevProps.dataContext.roleId === nextProps.dataContext.roleId &&
    prevProps.isEditMode === nextProps.isEditMode
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    cell: {
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

DutyAutocomplete.propTypes = {
  dataId: PropTypes.number,
  options: PropTypes.array,
  dataContext: PropTypes.object,
  onChange: PropTypes.func,
  renderOption: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default DutyAutocomplete;
