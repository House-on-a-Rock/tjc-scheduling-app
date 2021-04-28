import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { TimeCell, DutyAutocomplete, TasksAutocomplete, TableHeader, TableBody } from '.';
import {
  renderOption,
  days,
  teammates,
  createBlankEvent,
  retrieveDroppableServiceId,
  // shouldDisplayTime,
} from './utilities';

// Material UI
import MuiTable from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles, createStyles, fade, darken } from '@material-ui/core/styles';
import ReorderIcon from '@material-ui/icons/Reorder';

// Styles
import { paletteTheme } from '../../shared/styles/theme';

const Table = ({
  schedule,
  isEditMode,
  dataModel,
  setDataModel,
  users,
  teams,
  churchId,
  isScheduleModified,
  setIsScheduleModified,
  retrieveChangesSeed,
}) => {
  const classes = useStyles();
  const [selectedEvents, setSelectedEvents] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const { columns: headers, services, title, view } = schedule;
  // console.log(`dataModel`, dataModel);

  return (
    <div className={classes.scheduleTable}>
      <MuiTable className={classes.table}>
        <TableHeader headers={headers} title={title} />

        {dataModel.map((service, serviceIndex) => {
          const { day, name, events, serviceId } = service;
          return (
            <DragDropContext onDragEnd={onDragEnd} key={`${serviceIndex}`}>
              <Droppable
                droppableId={`DroppableTable-${serviceIndex}`}
                key={`Droppable_${serviceId}`}
                direction="vertical"
              >
                {(droppableProvided) => (
                  <TableBody
                    key={`TableBody-${name}`}
                    title={`${days[day]} ${name}`}
                    providedRef={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                    isEdit={isEditMode}
                    addEvent={() => addEvent(serviceIndex)}
                    deleteService={() => deleteService(serviceId)}
                  >
                    {events.map((event, rowIndex) => {
                      const { roleId, cells, time, eventId } = event;
                      const isSelected = selectedEvents.includes(eventId);
                      const tasksDataSet = teammates(users, roleId, churchId);
                      const isTimeDisplayed = shouldDisplayTime(
                        time,
                        rowIndex,
                        serviceIndex,
                      );

                      return (
                        <Draggable
                          draggableId={`DragRow_${eventId}`}
                          index={rowIndex}
                          key={`DragRow_${eventId}`}
                          isDragDisabled={!isEditMode}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              key={`${serviceIndex}-${rowIndex}`}
                              hover
                              onDoubleClick={() => handleRowSelected(isSelected, eventId)}
                              selected={isSelected}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style,
                                background: snapshot.isDragging
                                  ? 'rgba(245,245,245, 0.75)'
                                  : 'none',
                              }}
                            >
                              <TableCell align="left">
                                {isEditMode && (
                                  <div {...provided.dragHandleProps}>
                                    <ReorderIcon />
                                  </div>
                                )}
                              </TableCell>
                              {cells.map((cell, columnIndex) => {
                                const roleDataContext = {
                                  serviceIndex,
                                  rowIndex,
                                  roleId,
                                };
                                const taskDataContext = {
                                  taskId: cell.taskId,
                                  roleId: roleId,
                                  serviceIndex,
                                  rowIndex,
                                  columnIndex,
                                };
                                return columnIndex === 0 ? (
                                  <TimeCell
                                    time={time}
                                    isDisplayed={isTimeDisplayed}
                                    onChange={onTimeChange}
                                    rowIndex={rowIndex}
                                    serviceIndex={serviceIndex}
                                    key={`Time_${serviceIndex}`}
                                  />
                                ) : columnIndex === 1 ? (
                                  <DutyAutocomplete
                                    dataId={roleId}
                                    options={teams}
                                    dataContext={roleDataContext}
                                    onChange={onAssignedRoleChange}
                                    key={`Team_${serviceIndex}_${rowIndex}_${columnIndex}`}
                                    renderOption={renderOption}
                                  />
                                ) : (
                                  <TasksAutocomplete
                                    dataId={cell.userId}
                                    roleId={roleId}
                                    options={tasksDataSet}
                                    dataContext={taskDataContext}
                                    onChange={onTaskChange}
                                    renderOption={renderOption}
                                    key={`Task_${serviceIndex}_${rowIndex}_${columnIndex}`}
                                  />
                                );
                              })}
                            </TableRow>
                          )}
                        </Draggable>
                      );
                    })}
                    {droppableProvided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          );
        })}
      </MuiTable>
    </div>
  );

  function onDragEnd(result) {
    const {
      destination: { index: destination },
      source: { index: source },
    } = result;
    const sourceService = retrieveDroppableServiceId(result);
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }
    setDataModel((prev) => {
      return rearrangeEvents(prev, sourceService, source, destination);
    });
  }

  function deleteService(serviceId) {
    let dataClone = [...dataModel];
    const filteredServices = dataClone.filter(
      (service) => service.serviceId !== serviceId,
    );
    dataClone = filteredServices;
    setDataModel(dataClone);
    // retrieveChangesSeed();
  }

  function addEvent(serviceIndex) {
    const dataClone = [...dataModel];
    const targetEvents = dataClone[serviceIndex].events;
    const newEvent = createBlankEvent(dataClone.columns.length - 1, retrieveChangesSeed);
    targetEvents.push(newEvent);
    setDataModel(dataClone);
  }

  function removeEvent() {
    // TODO: make sure it works once contextmenu is fixed
    const dataClone = [...dataModel];
    let target = dataClone;
    const mutatedData = target.map((service) => {
      return {
        ...service,
        events: service.events.filter(({ eventId }) => !selectedEvents.includes(eventId)),
      };
    });
    target = mutatedData;
    setDataModel(dataClone);
    retrieveChangesSeed(); // called just to update changesSeed.
  }

  // onChange Handlers
  function onTaskChange(dataContext, newAssignee) {
    const { taskId, serviceIndex, rowIndex, columnIndex } = dataContext;
    const dataClone = [...dataModel];
    dataClone[serviceIndex].events[rowIndex].cells[columnIndex].userId = newAssignee;
    setDataModel(dataClone);
    setIsScheduleModified(true);
  }

  function onAssignedRoleChange(dataContext, newRoleId) {
    const { serviceIndex, rowIndex } = dataContext;
    const dataClone = [...dataModel];
    const targetEvent = dataClone[serviceIndex].events[rowIndex];
    targetEvent.roleId = newRoleId;

    setDataModel(dataClone);
  }

  function onTimeChange(newValue, rowIndex, serviceIndex) {
    const dataClone = [...dataModel];
    dataClone[serviceIndex].events[rowIndex].time = newValue;
    setDataModel(dataClone);
  }

  function handleRowSelected(isSelected, eventId) {
    return isSelected
      ? setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
      : setSelectedEvents([...selectedEvents, eventId]);
  }
  function shouldDisplayTime(time, rowIndex, serviceIndex) {
    // TODO update time string to standardized UTC string and use dedicated time inputs
    if (rowIndex === 0) return true;
    const previousEventsTime = dataModel[serviceIndex].events[rowIndex - 1].time;
    return previousEventsTime !== time;
  }
};

const normalCellBorderColor = 'rgba(234, 234, 234, 1)';
// const normalCellBorder = `1px solid ${normalCellBorderColor}`;

const useStyles = makeStyles(() =>
  createStyles({
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
          background: fade(paletteTheme.common.lightBlue, 0.15),
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
  }),
);
// { columns: headers, services, title, view } = schedule

Table.propTypes = {
  schedule: PropTypes.object,
  isEditMode: PropTypes.bool,
  dataModel: PropTypes.array,
  setDataModel: PropTypes.func,
  users: PropTypes.array,
  teams: PropTypes.array,
  churchId: PropTypes.number,
  isScheduleModified: PropTypes.bool,
  setIsScheduleModified: PropTypes.func,
  retrieveChangesSeed: PropTypes.func,
};

export default Table;
