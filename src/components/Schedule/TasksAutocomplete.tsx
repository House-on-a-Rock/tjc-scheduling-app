import React, { useState, useEffect } from 'react';
import {
  RoleDataContext,
  TaskDataContext,
} from '../../container/Schedules/ScheduleContainer';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme.js';
import { useAutoCompleteHook } from './useAutocompleteHook';
import { useTasksAutocompleteHooks } from './useTasksAutocompleteHooks';

/*
  Props explanation

  dataId:             userId/roleId assigned 
  extractOptionId?:   function to extract ids from dataset
  dataSet:            dataset from which to display autocomplete options, contains all the other info 
  onChange:           onChangeHandler
  dataContext:        contains info like rowIndex/serviceIndex/roleId, used by onChange callback. This is Changed between task cells and duty cells
  getOptionLabel:     string that shows in autocomplete
  renderOption?:      basically just adds an icon to indicate which was the previously saved option, may be used to add more stuff
  isSaved: boolean;   if initialData should update to the latest dataId
*/

interface AutocompleteCellProps {
  dataId: number;
  dataSet: any;
  roleId: number;
  extractOptionId?: (data: any) => number[];
  onChange: (dataContext: any, newValue: number) => void;
  dataContext: RoleDataContext | TaskDataContext;
  getOptionLabel: (option: number, dataSet: any) => string;
  renderOption?: (display: string, isIconVisible: boolean) => JSX.Element;
  isCellModified?;
  isCellWarning?;
  isSaved?: boolean;
}

export const TasksAutocomplete = React.memo((props: AutocompleteCellProps) => {
  const {
    dataId,
    dataSet,
    roleId,
    dataContext,
    isSaved,
    extractOptionId,
    onChange,
    getOptionLabel,
    renderOption,
  } = props;
  const classes = useStyles();

  const [
    isCellModified,
    isCellWarning,
    managedDataSet,
    initialData,
  ] = useTasksAutocompleteHooks(dataId, roleId, dataSet);

  const tableCellClass = isCellWarning
    ? classes.warning
    : isCellModified
    ? classes.modified
    : classes.cell;

  function onCellModify(isChanged: boolean, newValue: number) {
    onChange(dataContext, newValue);
  }

  return (
    <TableCell className={tableCellClass}>
      <Autocomplete
        id="combo-box"
        options={extractOptionId(managedDataSet)}
        renderInput={(params: any) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              style: { fontSize: 14 },
            }}
          />
        )}
        getOptionLabel={(option: number) => getOptionLabel(option, managedDataSet)}
        getOptionDisabled={(option) => option === dataId}
        renderOption={(option) =>
          renderOption(
            getOptionLabel(option, managedDataSet),
            option === initialData.dataId,
          )
        }
        value={dataId}
        onChange={(event, newValue: number) =>
          onCellModify(newValue !== initialData.dataId, newValue)
        }
        disableClearable
        fullWidth
        clearOnBlur
        openOnFocus
        forcePopupIcon={false}
        autoHighlight={true}
      />
    </TableCell>
  );
}, arePropsEqual);

function arePropsEqual(
  prevProps: AutocompleteCellProps,
  nextProps: AutocompleteCellProps,
) {
  const b =
    prevProps.dataId === nextProps.dataId &&
    prevProps.dataContext.roleId === nextProps.dataContext.roleId;

  // if (!b) console.log('prevprops: ', prevProps.dataSet, 'nextprops: ', nextProps.dataSet);
  return (
    prevProps.dataId === nextProps.dataId &&
    prevProps.dataContext.roleId === nextProps.dataContext.roleId &&
    prevProps.isCellModified === nextProps.isCellModified &&
    prevProps.isCellWarning === nextProps.isCellWarning
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
interface InitialDataInterface {
  dataId: number;
  roleId: number;
  dataSet: any;
}

/* 
** how much error checking is there? maybe when trying to save to db, db will return any errors

1. on role change, or if change task assignee --> change role. -- want to remember whatever was assigned, have that cell turn red, and leave it unselectable at top of list
    - remember prev assignee and details
    - add to list of options, and grey it out if unavailable
2. list will have all of the new potential assignees + original assignee. original assignee shud be unselectable (unless available), and cell should turn blue after selection
3. if role is returned to original role without any assignees being changed, cells should turn return to white (or blue if changed but not saved). 
    if assigness were changed, those cells should be red to indicate role was changed on them, and require attention.
    When returning to original role, list needs to return to original list.

4. if role is changed, but assignee is also available for said role, it should still turn red at first. when clicked on, the list should show that name as available for selection,
    and if selected, cell turns blue like normal.


*/
