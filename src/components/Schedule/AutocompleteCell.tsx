import React, { useState, useEffect } from 'react';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme.js';

interface AutocompleteCellProps {
  dataId: number;
  optionIds?: number[];
  dataSet: any;
  onTaskModified: any;
  dataContext: number;
  determineDisplay: (option: number, dataSet: any) => string;
  renderOption?: (display: string, isIconVisible: boolean) => JSX.Element;
}

export const AutocompleteCell = React.memo(
  ({
    dataId,
    optionIds = [],
    onTaskModified,
    dataSet,
    dataContext,
    determineDisplay,
    renderOption,
  }: AutocompleteCellProps) => {
    const classes = useStyles();
    const [value, setValue] = useState(dataId);
    const [isCellModified, setIsCellModified] = useState<boolean>(false);

    function onCellModify(isChanged: boolean, newValue: any) {
      setIsCellModified(isChanged);
      onTaskModified(dataContext, newValue, isChanged);
      setValue(newValue);
    }

    // resets background color when new data is received
    useEffect(() => setIsCellModified(false), [dataId]);

    return (
      <TableCell className={isCellModified ? classes.modified : classes.cell}>
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
          getOptionLabel={(option: any) => determineDisplay(option, dataSet)}
          getOptionDisabled={(option) => option === value}
          renderOption={(option) =>
            renderOption(determineDisplay(option, dataSet), dataId === option)
          }
          value={value}
          onChange={(event, newValue) => onCellModify(newValue !== dataId, newValue)}
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
  return prevProps.dataId === nextProps.dataId;
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
    input: {
      fontSize: 50,
    },
  }),
);
