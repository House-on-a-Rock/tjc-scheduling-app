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
  processUpdate,
  processAdded,
  processRemoved,
  // shouldDisplayTime,
} from './utilities';

// Material UI
import MuiTable from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles, createStyles, fade, darken } from '@material-ui/core/styles';
import ReorderIcon from '@material-ui/icons/Reorder';
import RemoveIcon from '@material-ui/icons/Remove';
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
}) => {
  const classes = useStyles();
  const [selectedEvents, setSelectedEvents] = useState([]);

  const { columns: headers, services, title, view } = schedule;

  return (
    <div className={classes.scheduleTable}>
      <MuiTable className={classes.table}>
        <TableHeader headers={headers} title={title} />

        {services.map((service, serviceIndex) => {
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
                  >
                    {isEditMode && (
                      <>
                        <button onClick={() => deleteService(serviceId)}>
                          Delete Service
                        </button>
                        <button onClick={() => addEvent(serviceIndex)}>Add Event</button>
                      </>
                    )}

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
                                    // isSaved={isSaved}
                                  />
                                ) : (
                                  <TasksAutocomplete
                                    dataId={cell.userId}
                                    roleId={roleId}
                                    options={tasksDataSet}
                                    dataContext={taskDataContext}
                                    onChange={onTaskChange}
                                    renderOption={renderOption}
                                    // isSaved={isSaved}
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
    const dataClone = [...dataModel];
    const filteredServices = dataClone.services.filter(
      (service) => service.serviceId !== serviceId,
    );
    dataClone.services = filteredServices;
    setDataModel(dataClone);
    // retrieveChangesSeed();
  }

  function addEvent(serviceIndex) {
    const dataClone = [...dataModel];
    const targetEvents = dataClone.services[serviceIndex].events;
    const newEvent = createBlankEvent(dataClone.columns.length - 1, retrieveChangesSeed);
    targetEvents.push(newEvent);
    setDataModel(dataClone);
  }

  function removeEvent() {
    // TODO: make sure it works once contextmenu is fixed
    const dataClone = [...dataModel];
    const target = dataClone;
    const mutatedData = target.services.map((service) => {
      return {
        ...service,
        events: service.events.filter(({ eventId }) => !selectedEvents.includes(eventId)),
      };
    });
    target.services = mutatedData;
    setDataModel(dataClone);
    retrieveChangesSeed(); // called just to update changesSeed.
  }

  function shouldDisplayTime(time, rowIndex, serviceIndex) {
    // TODO update time string to standardized UTC string and use dedicated time inputs
    if (rowIndex === 0) return true;
    const previousEventsTime = dataModel.services[serviceIndex].events[rowIndex - 1].time;
    return previousEventsTime !== time;
  }
  // onChange Handlers
  function onTaskChange(dataContext, newAssignee) {
    const { taskId, serviceIndex, rowIndex, columnIndex } = dataContext;
    const dataClone = [...dataModel];
    dataClone.services[serviceIndex].events[rowIndex].cells[
      columnIndex
    ].userId = newAssignee;
    setDataModel(dataClone);
    setIsScheduleModified(true);
  }

  function onAssignedRoleChange(dataContext, newRoleId) {
    const { serviceIndex, rowIndex } = dataContext;
    const dataClone = [...dataModel];
    const targetEvent = dataClone.services[serviceIndex].events[rowIndex];
    targetEvent.roleId = newRoleId;

    setDataModel(dataClone);
  }

  function onTimeChange(newValue, rowIndex, serviceIndex) {
    const dataClone = [...dataModel];
    dataClone.services[serviceIndex].events[rowIndex].time = newValue;
    setDataModel(dataClone);
  }

  function rearrangeEvents(prevModel, sourceService, source, destination) {
    const temp = [...prevModel];
    const scope = temp.services[sourceService].events;
    const src = scope.splice(source, 1);
    scope.splice(destination, 0, src[0]);
    return temp;
  }
};

const normalCellBorderColor = 'rgba(234, 234, 234, 1)';
const normalCellBorder = `1px solid ${normalCellBorderColor}`;

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

// Table.propTypes = {
//   title: PropTypes.string,
//   children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
//     .isRequired,
//   outerRef: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
//   ]),
// };

export default Table;
