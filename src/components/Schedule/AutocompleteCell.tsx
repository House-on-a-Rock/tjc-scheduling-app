import React, { useState } from 'react';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme.js';
import { useAutoCompleteHook } from './useAutocompleteHook';

/*
  Props explanation

  dataId:             userId/roleId assigned 
  extractOptionId?:   function to extract ids from dataset
  dataSet:            dataset from which to display autocomplete options, contains all the other info 
  onChange:           onChangeHandler
  dataContext:        contains info like rowIndex/serviceIndex/roleId, used by onChange callback. This is different between task cells and duty cells
  getOptionLabel:     string that shows in autocomplete
  renderOption?:      basically just adds an icon to indicate which was the previously saved option, may be used to add more stuff
  isSaved: boolean;   if initialData should update to the latest dataId
*/

interface AutocompleteCellProps {
  dataId: number;
  extractOptionId?: (data: any) => number[];
  dataSet: any;
  onChange: (dataContext: any, newValue: number, isChanged: boolean) => void;
  dataContext: any;
  getOptionLabel: (option: number, dataSet: any) => string;
  renderOption?: (display: string, isIconVisible: boolean) => JSX.Element;
  isSaved: boolean;
}

export const AutocompleteCell = React.memo((props: AutocompleteCellProps) => {
  const {
    dataId,
    dataSet,
    dataContext,
    isSaved,
    extractOptionId,
    onChange,
    getOptionLabel,
    renderOption,
  } = props;
  const classes = useStyles();
  const [value, setValue] = useState<number>(dataId);
  // TODO value causes warning when adding events because its negative

  // i just copy-pasted 99% of the logic into the hook and it works sooooooooo
  const [
    managedData,
    optionIds,
    initialData,
    isCellModified,
    setIsCellModified,
    isCellWarning,
    setIsCellWarning,
  ] = useAutoCompleteHook(dataId, dataSet, dataContext, isSaved, extractOptionId);

  function onCellModify(isChanged: boolean, newValue: number) {
    setIsCellModified(isChanged);
    setIsCellWarning(false);
    onChange(dataContext, newValue, isChanged);
    setValue(newValue);
  }

  const tableCellClass = isCellWarning
    ? classes.warning
    : isCellModified
    ? classes.modified
    : classes.cell;

  return (
    <TableCell className={tableCellClass}>
      <Autocomplete
        id="combo-box"
        options={optionIds}
        renderInput={(params: any) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              style: { fontSize: 14 },
            }}
          />
        )}
        getOptionLabel={(option: number) => getOptionLabel(option, managedData)}
        getOptionDisabled={(option) => option === value}
        renderOption={(option) =>
          renderOption(
            getOptionLabel(option, managedData),
            option === initialData.current.dataId,
          )
        }
        value={value}
        onChange={(event, newValue: number) =>
          onCellModify(newValue !== initialData.current.dataId, newValue)
        }
        disableClearable
        fullWidth
        clearOnBlur
        openOnFocus
        forcePopupIcon={false}
        autoHighlight={false}
      />
    </TableCell>
  );
}, arePropsEqual);

function arePropsEqual(
  prevProps: AutocompleteCellProps,
  nextProps: AutocompleteCellProps,
) {
  return (
    prevProps.dataId === nextProps.dataId &&
    prevProps.dataContext.roleId === nextProps.dataContext.roleId
  );
}

const useStyles = makeStyles((theme: Theme) =>
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
