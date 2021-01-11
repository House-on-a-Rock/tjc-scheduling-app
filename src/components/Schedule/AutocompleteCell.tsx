import React, { useState, useEffect, useRef } from 'react';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme.js';

interface AutocompleteCellProps {
  dataId: number;
  extractOptionId?: (data: any) => number[]; // function to extract ids from dataset
  dataSet: any; // dataset from which to display autocomplete
  onChange: (dataContext: any, newValue: number, isChanged: boolean) => void;
  dataContext: any; // contains info like rowIndex / serviceIndex / roleId, used by on___Changed. This is different between task cells and duty cells
  getOptionLabel: (option: number, dataSet: any) => string; // string is what shows up in the autocomplete
  renderOption?: (display: string, isIconVisible: boolean) => JSX.Element; // basically just adds the - icon to indicate which was the previously saved option, may be used to add more stuff
  isSaved: boolean; // if initialData should update to the latest dataId
}

export const AutocompleteCell = React.memo(
  ({
    dataId,
    extractOptionId,
    onChange,
    dataSet,
    dataContext,
    getOptionLabel,
    renderOption,
    isSaved,
  }: AutocompleteCellProps) => {
    const classes = useStyles();
    const [value, setValue] = useState<number>(dataId);
    const [managedData, setManagedData] = useState(dataSet);
    const [optionIds, setOptionIds] = useState<number[]>([]);
    const [isCellModified, setIsCellModified] = useState<boolean>(false);
    const [isCellWarning, setIsCellWarning] = useState<boolean>(false);
    const initialData = useRef<initialDataInterface>(null);

    function onCellModify(isChanged: boolean, newValue: number) {
      setIsCellModified(isChanged);
      setIsCellWarning(false);
      onChange(dataContext, newValue, isChanged);
      setValue(newValue);
    }

    function doesDataContextMatch(): boolean {
      return dataContext.roleId === initialData.current.dataContext.roleId;
    }

    function setInitialRefData() {
      initialData.current = {
        dataId,
        dataSet: managedData,
        dataContext,
      };
    }

    function onRoleChanged() {
      const previouslySelected = initialData.current.dataSet.filter(
        (user) => user.userId === initialData.current.dataId,
      )[0];

      const managedDataClone = [...dataSet];
      managedDataClone.unshift(previouslySelected);
      setManagedData(managedDataClone);
      setOptionIds(extractOptionId(managedDataClone));
    }

    /* on a re-render
       1. Check if dataContext.roleId is different, if it is,
       2. Tack on previous selection from useRef to the new dataSet, set it as managedDataSet
       3. Get new option ids from new dataSet, and set it as optionIds
    */

    // getOptionLabel renders based on option and dataset
    useEffect(() => {
      setInitialRefData();
    }, []);

    useEffect(() => {
      setManagedData(dataSet);
      setOptionIds(extractOptionId(dataSet));
    }, [dataSet]);

    useEffect(() => {
      if (!doesDataContextMatch()) {
        setIsCellWarning(true);
        if (dataContext.taskId) onRoleChanged(); // only run this for the task cells, not duty cells
      } else setIsCellWarning(false);
    }, [dataContext.roleId]);

    useEffect(() => {
      if (isSaved) {
        setInitialRefData();
        setIsCellModified(false);
      }
    }, [isSaved]);

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
  },
  arePropsEqual,
);

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

interface initialDataInterface {
  dataId: number;
  dataSet: any;
  dataContext: any;
}
