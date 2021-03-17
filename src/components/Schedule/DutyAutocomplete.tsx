import React, { useState } from 'react';
import { RoleDataContext } from '../../container/Schedules/ScheduleContainer';

// mat ui
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { typographyTheme } from '../../shared/styles/theme.js';

/*
  Props explanation

  dataId:             userId/roleId assigned 
  extractOptionId?:   function to extract ids from dataset
  dataSet:            dataset from which to display autocomplete options, contains all the other info 
  onChange:           onChangeHandler
  dataContext:        contains info like rowIndex/serviceIndex/roleId, used by onChange callback.
  getOptionLabel:     string that shows in autocomplete
  renderOption?:      basically just adds an icon to indicate which was the previously saved option, may be used to add more stuff
  isSaved: boolean;   if initialData should update to the latest dataId
*/

interface AutocompleteCellProps {
  dataId?: number;
  dataSet?: any;
  extractOptionId?: (data: any) => number[];
  onChange: (dataContext: any, newValue: number) => void;
  dataContext: RoleDataContext;
  getOptionLabel: (option: number, dataSet: any) => string;
  renderOption?: (display: string, isIconVisible: boolean) => JSX.Element;
  isCellModified?;
  isCellWarning?;
  isSaved?: boolean;
}

export const DutyAutocomplete = React.memo((props: AutocompleteCellProps) => {
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

  const [isCellModified, setIsCellModified] = useState<boolean>(false);
  const [initialData] = useState<number>(dataId);

  function onCellModify(isChanged: boolean, newValue: number) {
    setIsCellModified(isChanged);
    onChange(dataContext, newValue);
  }

  const tableCellClass = isCellModified ? classes.modified : classes.cell;

  return (
    <TableCell className={tableCellClass}>
      <Autocomplete
        id="combo-box"
        options={extractOptionId(dataSet)}
        renderInput={(params: any) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              style: { fontSize: 14 },
            }}
          />
        )}
        getOptionLabel={(option: number) => getOptionLabel(option, dataSet)}
        getOptionDisabled={(option) => option === dataId}
        renderOption={(option) =>
          renderOption(getOptionLabel(option, dataSet), option === initialData)
        }
        value={dataId}
        onChange={(event, newValue: number) =>
          onCellModify(newValue !== initialData, newValue)
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
