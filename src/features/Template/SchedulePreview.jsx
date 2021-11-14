import PropTypes from 'prop-types';

import MuiTable from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import MuiCell from '@material-ui/core/TableCell';

import {
  TableBody,
  TableCell,
  TableHeader,
  TimeCell,
  DutyAutocomplete,
  PlaceHolderCell,
  TasksAutocomplete,
} from '../Schedule';

import { days } from '../Schedule/utilities';
import { makeStyles, fade, darken } from '@material-ui/core/styles';

import { paletteTheme } from '../../shared/styles/theme';

const SchedulePreview = ({ schedule, dataModel, teams }) => {
  const { columns: headers, title } = schedule; // todo rename columns to just headers
  console.log(`schedule`, schedule);
  console.log(`dataModel`, dataModel);

  const classes = useStyles();

  return (
    <MuiTable className={classes.table}>
      <TableHeader headers={headers} title={title} />
      {dataModel.map((service, serviceIndex) => {
        const { day, name, events, serviceId } = service;
        return (
          <TableBody title={`${days[day]} - ${name}`} key={serviceIndex}>
            {events.map((event, rowIndex) => {
              const { roleId, cells, time, eventId } = event;
              const isTimeDisplayed = shouldDisplayTime(time, rowIndex, serviceIndex);
              return (
                <TableRow key={`${serviceIndex}-${rowIndex}`}>
                  <MuiCell className={classes.iconContainer} />
                  {cells.map((cell, columnIndex) => {
                    return columnIndex === 0 ? (
                      <TimeCell
                        time={time}
                        isDisplayed={isTimeDisplayed}
                        rowIndex={rowIndex}
                        serviceIndex={serviceIndex}
                      />
                    ) : columnIndex === 1 ? (
                      <DutyAutocomplete dataId={roleId} options={teams} />
                    ) : cell.userId === null && cell.taskId === null ? (
                      <PlaceHolderCell />
                    ) : (
                      <MuiCell>
                        <TasksAutocomplete />
                      </MuiCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        );
      })}
    </MuiTable>
  );

  function shouldDisplayTime(time, rowIndex, serviceIndex) {
    // TODO update time string to standardized UTC string and use dedicated time inputs
    if (rowIndex === 0) return true;
    const previousEventsTime = dataModel[serviceIndex].events[rowIndex - 1].time;
    return previousEventsTime !== time;
  }
};

const normalCellBorderColor = 'rgba(234, 234, 234, 1)';

const useStyles = makeStyles({
  scheduleTable: {
    position: 'absolute',
    paddingTop: 10,
  },
  table: {
    borderCollapse: 'inherit',
    marginBottom: '1rem',

    // first column:
    '& td:first-child, th:first-child': {
      left: '8px',
      width: '12ch', // need this when there's very few columns
      '& input': {
        width: '12ch',
        textAlign: 'center',
      },
      '&:before': {
        // use a pseudo-element to cover left-side gap when scrolling
        content: '""',
        background: 'white',
        position: 'absolute',
        width: '8px',
        top: '-1px',
        left: '-9px',
        height: '106%',
      },
    },

    // second column:
    '& td:nth-child(2), th:nth-child(2)': {
      left: '135px',
      width: '14ch', // need this when there's very few columns
      '& input': {
        width: '14ch',
      },
      borderRightWidth: 0,
      '&:after': {
        // use a pseudo-element to cover right-side gap when scrolling
        content: '""',
        // background: fade(paletteTheme.common.lightBlue, 0.15),
        position: 'absolute',
        width: '5px',
        top: '-1px',
        left: 'calc(100% - 2.5px)',
        height: '106%',
      },
    },

    // third column:
    '& td:nth-child(3), th:nth-child(3)': {
      borderLeftWidth: 0,
    },

    // last row:
    '& tr:last-child td': {
      borderBottomWidth: '2px',
      borderBottomColor: darken(normalCellBorderColor, 0.25),
    },
  },
  visibleEdit: {
    visibility: 'visible',
  },
  invisibleEdit: {
    visibility: 'collapse',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

SchedulePreview.propTypes = {
  schedule: PropTypes.object,
  dataModel: PropTypes.array,
  teams: PropTypes.array,
};

export default SchedulePreview;
