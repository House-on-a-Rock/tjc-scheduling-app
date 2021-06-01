import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { EditServiceForm, TableHeader, TableBody, TableCell } from '.';
import {
  days,
  teammates,
  createBlankEvent,
  retrieveDroppableServiceId,
  rearrangeEvents,
  cellStatus,
} from './utilities';

// Material UI
import MuiTable from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import MuiCell from '@material-ui/core/TableCell';
import { makeStyles, createStyles, fade, darken } from '@material-ui/core/styles';
import ReorderIcon from '@material-ui/icons/Reorder';
import RemoveIcon from '@material-ui/icons/Remove';

// Styles
import { paletteTheme } from '../../shared/styles/theme';

// selected row stuff doesnt work, mbbe not needed

const Table = ({
  schedule,
  isEditMode,
  dataModel,
  setDataModel,
  users,
  teams,
  churchId,
  isScheduleModified,
  incrementChangesCounter,
}) => {
  const classes = useStyles();

  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(); // by serviceId
  const { columns: headers, title } = schedule;

  return (
    <div className={classes.scheduleTable}>
      {isEditServiceOpen && (
        <EditServiceForm
          isOpen={isEditServiceOpen}
          onClose={() => setIsEditServiceOpen(false)}
          serviceId={selectedService}
          dataModel={dataModel}
          onSubmit={onSubmitEditService}
        />
      )}
      <MuiTable className={classes.table}>
        <TableHeader headers={headers} title={title} />

        {dataModel.map((service, serviceIndex) => {
          const { day, name, events, serviceId } = service;

          return (
            <DragDropContext onDragEnd={onDragEnd} key={`${title}_${serviceIndex}`}>
              <Droppable
                droppableId={`DroppableTable-${serviceIndex}`}
                key={`Droppable_${serviceId}`}
                direction="vertical"
              >
                {(droppableProvided) => (
                  <TableBody
                    key={`TableBody-${name}`}
                    title={`${days[day]} - ${name}`}
                    serviceId={serviceId}
                    providedRef={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                    isEdit={isEditMode}
                    addEvent={() => addEvent(serviceIndex)}
                    deleteService={() => deleteService(serviceId)}
                    onEditService={onEditService}
                  >
                    {events.map((event, rowIndex) => {
                      const { roleId, cells, time, eventId } = event;

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
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style,
                                background: snapshot.isDragging
                                  ? 'rgba(245,245,245, 0.75)'
                                  : 'none',
                              }}
                            >
                              <MuiCell align="left">
                                <div className={classes.iconContainer}>
                                  <div {...provided.dragHandleProps}>
                                    <ReorderIcon
                                      className={
                                        isEditMode
                                          ? classes.visibleEdit
                                          : classes.invisibleEdit
                                      }
                                    />
                                  </div>
                                  <RemoveIcon
                                    onClick={() => removeEvent(serviceIndex, rowIndex)}
                                    className={
                                      isEditMode
                                        ? classes.visibleEdit
                                        : classes.invisibleEdit
                                    }
                                    style={{ color: 'red' }}
                                  />
                                </div>
                              </MuiCell>
                              {cells.map((cell, columnIndex) => (
                                <TableCell
                                  cellIndices={{
                                    serviceIndex: serviceIndex,
                                    rowIndex: rowIndex,
                                    columnIndex: columnIndex,
                                  }}
                                  roleId={roleId}
                                  userId={cell.userId}
                                  taskId={cell.taskId}
                                  status={cell.status}
                                  date={cell.date}
                                  time={time}
                                  teams={teams}
                                  users={users}
                                  onTimeChange={onTimeChange}
                                  onAssignedRoleChange={onAssignedRoleChange}
                                  onTaskChange={onTaskChange}
                                  isTimeDisplayed={isTimeDisplayed}
                                  tasksDataSet={tasksDataSet}
                                  isScheduleModified={isScheduleModified}
                                  isEditMode={isEditMode}
                                  key={`${title}_${serviceIndex}_${rowIndex}_${columnIndex}`}
                                />
                              ))}
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

  function onEditService(serviceId) {
    setSelectedService(serviceId);
    setIsEditServiceOpen(true);
  }

  function onSubmitEditService(dataClone) {
    setDataModel(dataClone);
    setIsEditServiceOpen(false);
  }

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
  }

  function addEvent(serviceIndex) {
    const dataClone = [...dataModel];
    const targetEvents = dataClone[serviceIndex].events;
    const serviceId = dataClone[serviceIndex].serviceId;
    const newEvent = createBlankEvent(serviceId, incrementChangesCounter);
    targetEvents.push(newEvent);
    setDataModel(dataClone);
  }

  function removeEvent(serviceIndex, rowIndex) {
    const dataClone = [...dataModel];
    dataClone[serviceIndex].events.splice(rowIndex, 1);
    setDataModel(dataClone);
  }

  // onChange Handlers
  function onTaskChange(dataContext, newAssignee, initialId) {
    const { serviceIndex, rowIndex, columnIndex } = dataContext;
    setDataModel((clone) => {
      const dataClone = [...clone];

      const targetCell = dataClone[serviceIndex].events[rowIndex].cells[columnIndex];
      targetCell.userId = newAssignee;

      if (newAssignee === initialId) targetCell.status = cellStatus.SYNCED;
      else targetCell.status = cellStatus.MODIFIED;

      return dataClone;
    });
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
    visibleEdit: {
      visibility: 'visible',
    },
    invisibleEdit: {
      visibility: 'hidden',
    },
    iconContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }),
);

Table.propTypes = {
  schedule: PropTypes.object,
  isEditMode: PropTypes.bool,
  dataModel: PropTypes.array,
  setDataModel: PropTypes.func,
  users: PropTypes.array,
  teams: PropTypes.array,
  churchId: PropTypes.number,
  isScheduleModified: PropTypes.bool,
  incrementChangesCounter: PropTypes.func,
};

export default Table;
