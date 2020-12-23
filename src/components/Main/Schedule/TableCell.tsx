import React, { useState, useEffect } from 'react';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import RemoveIcon from '@material-ui/icons/Remove';

import { typographyTheme } from '../../../shared/styles/theme.js';

interface DataCellProps {
  data: any;
  options?: any;
  onTaskModified: any;
}

export const DataCell = React.memo(
  ({ data, options = [], onTaskModified }: DataCellProps) => {
    const classes = useStyles();
    const [value, setValue] = useState(data);
    const [isCellModified, setIsCellModified] = useState<boolean>(false);

    function onCellModify(isChanged: boolean, newValue: any) {
      setIsCellModified(isChanged);
      onTaskModified(data.taskId, newValue.userId, isChanged);
      setValue(newValue);
    }

    const cellStyle = isCellModified ? classes.modified : classes.cell; // normally i'd combine styling objects to reduce repetition, but these are strings so idk

    // resets background color when new data is received
    useEffect(() => setIsCellModified(false), [data]);

    const filteredOptions = options.filter(
      (member: any) => member.userId !== value.userId,
    );

    // TODO debug the autocomplete warning

    return (
      <TableCell className={cellStyle}>
        <Autocomplete
          id="combo-box"
          options={filteredOptions}
          renderInput={(params: any) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                style: { fontSize: 14 },
              }}
            />
          )}
          getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}`}
          getOptionSelected={(option: any, val: any) => option.userId === val.userId}
          renderOption={(option: any, state: any) => {
            // would like this to autosize so each option is just a single line
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {`${option.firstName} ${option.lastName}`}
                {option.userId === data.userId && (
                  <RemoveIcon style={{ height: 10, width: 10, paddingLeft: 4 }} /> // icon to show which one the original assignee is. any ideas on a more appropriate icon?
                )}
              </div>
            );
          }}
          value={value}
          onChange={(event, newValue) =>
            onCellModify(newValue.userId !== data.userId, newValue)
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

function arePropsEqual(prevProps: DataCellProps, nextProps: DataCellProps) {
  return prevProps.data.userId === nextProps.data.userId;
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
