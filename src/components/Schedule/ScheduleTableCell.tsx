import React, { useState, useEffect } from 'react';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme.js';

interface ScheduleTableCellProps {
  data: number;
  options?: number[];
  dataSet: any;
  onTaskModified: any;
  dataContext: number;
  processDataset: any;
  renderOption?: any;
}

export const ScheduleTableCell = React.memo(
  ({
    data,
    options = [],
    onTaskModified,
    dataSet,
    dataContext,
    processDataset,
    renderOption,
  }: ScheduleTableCellProps) => {
    const classes = useStyles();
    const [value, setValue] = useState(data);
    const [isCellModified, setIsCellModified] = useState<boolean>(false);

    function onCellModify(isChanged: boolean, newValue: any) {
      setIsCellModified(isChanged);
      onTaskModified(dataContext, newValue.userId, isChanged);
      setValue(newValue);
    }

    // resets background color when new data is received
    useEffect(() => setIsCellModified(false), [data]);

    return (
      <TableCell className={isCellModified ? classes.modified : classes.cell}>
        <Autocomplete
          id="combo-box"
          // options={options.filter((member: any) => member.userId !== value.userId)} // this fixes the warnings
          options={options}
          renderInput={(params: any) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                style: { fontSize: 14 },
              }}
            />
          )}
          getOptionLabel={(option: any) => processDataset(option, dataSet)}
          getOptionSelected={(option: any, val: any) => option === val}
          getOptionDisabled={(option) => option === value}
          // renderOption={(option) => renderOption(option, dataSet, data)}
          value={value}
          onChange={(event, newValue) => onCellModify(newValue !== data, newValue)}
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
  prevProps: ScheduleTableCellProps,
  nextProps: ScheduleTableCellProps,
) {
  return prevProps.data === nextProps.data;
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
