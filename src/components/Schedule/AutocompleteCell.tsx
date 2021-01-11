import React, { useState, useEffect, useRef } from 'react';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme.js';

interface AutocompleteCellProps {
  dataId: number;
  extractOptionId?: (data: any) => any; // or just pass in the function to extract IDs?
  dataSet: any; // dataset from which to display autocomplete
  onChange: (dataContext: any, newValue: number, isChanged: boolean) => void;
  dataContext: any; // contains info like rowIndex / serviceIndex / roleId, used by on___Changed. This is different between task cells and duty cells
  getOptionLabel: (option: number, dataSet: any) => string;
  renderOption?: (display: string, isIconVisible: boolean) => JSX.Element; // basically just adds the - icon to indicate which was the previously saved option, may be used to add more stuff
  isSaved: boolean; // if initialData should update to the latest dataI
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
    const [optionIds, setOptionIds] = useState([]);
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
      return dataContext?.roleId === initialData.current.dataContext?.roleId;
    }

    function setInitialRefData() {
      initialData.current = {
        dataId,
        dataSet: managedData,
        displayed: getOptionLabel(dataId, managedData), // pbly unnecessary
        dataContext,
      };
    }

    function onRoleChanged() {
      // add initial dataSet item to new dataSet
      const managedDataClone = [...managedData];
      managedDataClone.unshift(initialData.current.dataSet[dataId]);
      setManagedData(managedDataClone);
    }

    useEffect(() => {
      setInitialRefData();
      setManagedData(dataSet);
      setOptionIds(extractOptionId(dataSet));
    }, []);

    // when a new roleId is given, dataContext.roleId, options, and dataSet are updated but dataId is not
    // getOptionLabel renders based on option and dataset
    // when roleId changes, still show previous selection, but render new options
    //  tack on previous selection to the new option list, but

    useEffect(() => {
      setManagedData(dataSet);
      if (!doesDataContextMatch()) {
        setIsCellWarning(true);
        onRoleChanged();
      } else setIsCellWarning(false);
    }, [dataContext.roleId, dataSet]);

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
  displayed: string;
  dataContext: any;
}
