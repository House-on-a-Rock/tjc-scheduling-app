import React, { useState, useEffect, CSSProperties } from 'react';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import RemoveIcon from '@material-ui/icons/Remove';

import { typographyTheme, loadingTheme } from '../../shared/styles/theme.js';

interface ScheduleTableCellProps {
  data: any;
  options?: any;
  onTaskModified: any;
}

export const ScheduleTableCell = React.memo(
  ({ data, options = [], onTaskModified }: ScheduleTableCellProps) => {
    const classes = useStyles();
    const [value, setValue] = useState(data);
    const [isCellModified, setIsCellModified] = useState<boolean>(false);

    function onCellModify(isChanged: boolean, newValue: any) {
      setIsCellModified(isChanged);
      onTaskModified(data.taskId, newValue.userId, isChanged);
      setValue(newValue);
    }

    function renderOptions(option: any, state: any) {
      const { firstName, lastName, userId } = option;
      // would like this to autosize so each option is just a single line
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {`${firstName} ${lastName}`}
          {userId === data.userId && (
            <RemoveIcon style={{ height: 10, width: 10, paddingLeft: 4 }} /> // icon to show which one the original assignee is. any ideas on a more appropriate icon?
          )}
        </div>
      );
    }
    // resets background color when new data is received
    useEffect(() => setIsCellModified(false), [data]);

    // TODO debug the autocomplete warning

    return (
      <TableCell className={classes.cell + ' ' + classes.loading}>
        {/* <TableCell className={isCellModified ? classes.modified : classes.cell}>}
        {/* <TableCell className={classes.loading}> */}
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
          getOptionLabel={({ firstName, lastName }: any) => `${firstName} ${lastName}`}
          getOptionSelected={(option: any, val: any) => option.userId === val.userId}
          getOptionDisabled={(option) => option.userId === value.userId} // instead of completely hiding the currently selected option, the currently selected is disabled
          // filterOptions  // can also use this prop if disabling the selectedOption is undesirable
          renderOption={renderOptions}
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

function arePropsEqual(
  prevProps: ScheduleTableCellProps,
  nextProps: ScheduleTableCellProps,
) {
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
    loading: {
      ...loadingTheme,
    },
  }),
);
