/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
// https://codesandbox.io/s/react-material-ui-and-react-beautiful-dnd-forked-bmheb?file=/src/MaterialTable.tsx draggable table
import React, { useRef, useState, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import { Dialog, TableRow, TableCell } from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import RemoveIcon from '@material-ui/icons/Remove';
import { SchedulesDataInterface } from '../../query';
import {
  ScheduleTabs,
  ScheduleTable,
  NewScheduleForm,
  ScheduleTableHeader,
  ScheduleTableBody,
  ScheduleToolbar,
  NewServiceForm,
  TimeCell,
  DutyAutocomplete,
  TasksAutocomplete,
} from '../../components/Schedule';

import { ContextMenu, ConfirmationDialog } from '../../components/shared';

import { days, teammates, createBlankEvent } from './utilities';

import {
  useCreateSchedule,
  useDeleteSchedule,
  useCreateService,
  useDeleteEvent,
} from '../utilities/useMutations';

import { detailedDiff } from 'deep-object-diff';
const ld = require('lodash');

import {
  DragDropContext,
  Draggable,
  Droppable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

export interface BootstrapData {
  schedules: ScheduleTableInterface[];
  users: UsersDataInterface[];
  teams: TeamsDataInterface[];
  churchId: number;
}

interface ScheduleContainerProps {
  tabs: SchedulesDataInterface[];
  data: BootstrapData;
}

const SERVICE = 'service';
const EVENT = 'event';
const SCHEDULE = 'schedule';

export const ScheduleContainer = ({ tabs, data }: ScheduleContainerProps) => {
  const [tab, setTab] = useState(0);
  const [isScheduleModified, setIsScheduleModified] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState<boolean>(false);
  const [isNewServiceOpen, setIsNewServiceOpen] = useState<boolean>(false);
  const [warningDialog, setWarningDialog] = useState<string>('');
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  //   const [alert, setAlert] = useState<AlertInterface>();

  // manipulate events
  const [dataModel, setDataModel] = useState<ScheduleTableInterface[]>(
    ld.cloneDeep(data.schedules),
  );
  const templateChanges = useRef<TemplateChangesInterface>({
    changesSeed: -1,
  });

  const outerRef = useRef(null);

  const createSchedule = useCreateSchedule(setIsNewScheduleOpen);
  const deleteSchedule = useDeleteSchedule(setWarningDialog);
  const createService = useCreateService(setIsNewServiceOpen);
  const deleteEvent = useDeleteEvent();

  function onSaveScheduleChanges() {
    dataModelDiff();
    setIsScheduleModified(false);
  }

  function insertRow() {}

  const warningDialogConfig = {
    [SCHEDULE]: {
      title: 'Are you sure you want to delete this schedule? This cannot be undone',
      accepted: () => {
        setTab(0);
        deleteSchedule.mutate({ scheduleId: tabs[tab].id, title: tabs[tab].title });
      },
    },
  };

  const handleRowSelected = (isSelected: boolean, eventId: number) =>
    isSelected
      ? setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
      : setSelectedEvents([...selectedEvents, eventId]);

  function retrieveChangesSeed() {
    return templateChanges.current.changesSeed--;
  }

  function dataModelDiff() {
    const diff = detailedDiff(data.schedules, dataModel);
    // in progress
    // console.log(`diff`, diff);
    // console.log(`dataModel`, dataModel);
  }

  // Model manipulation functions
  const createBlankService = () => {
    return {
      name: 'test',
      day: 0,
      events: [],
      serviceId: retrieveChangesSeed(),
    };
  };

  function addEvent(serviceIndex: number) {
    const dataClone = [...dataModel];
    const targetEvents = dataClone[tab].services[serviceIndex].events;
    const newEvent = createBlankEvent(dataClone[tab].columns.length, retrieveChangesSeed);
    targetEvents.push(newEvent);
    setDataModel(dataClone);
  }

  function removeEvent() {
    // TODO: make sure it works once contextmenu is fixed
    const dataClone = [...dataModel];
    const target = dataClone[tab];
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

  function addService() {
    // TODO: bring back create new service form? or another solution is better
    const dataClone = [...dataModel];
    const target = dataClone[tab].services;
    target.push(createBlankService());
    setDataModel(dataClone);
  }

  function deleteService(serviceId: number) {
    const dataClone = [...dataModel];
    const filteredServices = dataClone[tab].services.filter(
      (service) => service.serviceId !== serviceId,
    );
    dataClone[tab].services = filteredServices;
    setDataModel(dataClone);
    // retrieveChangesSeed();
  }

  // autocomplete cell callback
  // in the future, can pass in warning icons or tooltips depending on the usecase.
  // maybe move elsewhere?
  function renderOption(display, isIconVisible: boolean) {
    return (
      // TODO move div styling somewhere else?
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {display}
        {isIconVisible && (
          <RemoveIcon style={{ height: 10, width: 10, paddingLeft: 4 }} /> // icon to show which one the original assignee is. any ideas on a more appropriate icon?
        )}
      </div>
    );
  }

  function shouldDisplayTime(
    time: string,
    rowIndex: number,
    serviceIndex: number,
  ): boolean {
    // TODO update time string to standardized UTC string and use dedicated time inputs
    if (rowIndex === 0) return true;
    const previousEventsTime =
      dataModel[tab].services[serviceIndex].events[rowIndex - 1].time;
    return previousEventsTime !== time;
  }

  // onChange Handlers
  function onTaskChange(dataContext, newAssignee: number) {
    const { taskId, serviceIndex, rowIndex, columnIndex } = dataContext;
    const dataClone = [...dataModel];
    dataClone[tab].services[serviceIndex].events[rowIndex].cells[
      columnIndex
    ].userId = newAssignee;
    setDataModel(dataClone);
    setIsScheduleModified(true);
  }

  function onAssignedRoleChange(dataContext, newRoleId) {
    const { serviceIndex, rowIndex } = dataContext;
    const dataClone = [...dataModel];
    const targetEvent = dataClone[tab].services[serviceIndex].events[rowIndex];
    targetEvent.roleId = newRoleId;

    setDataModel(dataClone);
  }

  function onTimeChange(newValue: string, rowIndex: number, serviceIndex: number) {
    const dataClone = [...dataModel];
    dataClone[tab].services[serviceIndex].events[rowIndex].time = newValue;
    setDataModel(dataClone);
  }

  function onChangeTabs(value: number) {
    if (value === tabs.length) return;
    setTab(value);
  }

  // TODO
  // contextmenu functions don't work
  // Need to wait for create schedule to finish updating db before the user can click on the new tab, or else data will be missing
  // newly created schedule has strange set of dates
  // rethink where to put draggable handles and how to display them
  // broke selection/hover of rows?

  const onDragEnd = useCallback((result) => {
    const {
      destination: { index: destination },
      source: { index: source },
    } = result;
    const sourceService = retrieveDroppableServiceId(result);
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }
    setDataModel((prev: ScheduleTableInterface[]) => {
      const temp = [...prev];
      const scope = temp[tab].services[sourceService].events;
      const src = scope.splice(source, 1);
      scope.splice(destination, 0, src[0]);
      return temp;
    });
  }, []);

  function retrieveDroppableServiceId(result) {
    return parseInt(result.source.droppableId[result.source.droppableId.length - 1]);
  }

  return (
    <>
      <div className="schedule-container" ref={outerRef}>
        {/* 1) Add an arrow into the tab that opens context menu */}
        {/* 2) Options in this context menu: rename schedule, delete schedule, color/style tabs */}
        <ScheduleTabs
          tabIdx={tab}
          onTabClick={onChangeTabs}
          tabs={tabs}
          handleAddClicked={() => setIsNewScheduleOpen(true)}
        />
        <ScheduleToolbar
          handleNewServiceClicked={addService}
          destroySchedule={() => setWarningDialog(SCHEDULE)}
          isScheduleModified={isScheduleModified}
          onSaveScheduleChanges={onSaveScheduleChanges}
        />
        <ContextMenu
          outerRef={outerRef}
          addRowHandler={insertRow}
          deleteRowHandler={removeEvent}
        />
        <Prompt
          when={isScheduleModified}
          message="You have unsaved changes, are you sure you want to leave? Unsaved changes will be lost"
        />
        {!dataModel && <div style={{ height: '50vh' }}></div>}
        {/* {alert && <Alert alert={alert} unMountAlert={() => setAlert(null)} />} */}
        {dataModel.map((schedule: ScheduleTableInterface, scheduleIndex) => {
          const { columns: headers, services, title, view } = schedule;
          return (
            <div key={scheduleIndex}>
              <ScheduleTable
                key={`${title}-${view}`}
                title={title}
                hidden={tab !== scheduleIndex}
              >
                {headers.map(({ Header }) => (
                  <ScheduleTableHeader key={`Header-${Header}`} header={Header} />
                ))}

                {services.map((service: ServiceDataInterface, serviceIndex: number) => {
                  const { day, name, events, serviceId } = service;
                  return (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable
                        droppableId={`DroppableTable-${serviceIndex}`}
                        key={`Droppable_${serviceId}`}
                        direction="vertical"
                      >
                        {(droppableProvided) => (
                          <ScheduleTableBody
                            key={`ScheduleTableBody-${name}`}
                            title={`${days[day]} ${name}`}
                            providedRef={droppableProvided.innerRef}
                            {...droppableProvided.droppableProps}
                          >
                            <button onClick={() => deleteService(serviceId)}>
                              Delete Service
                            </button>
                            <button onClick={() => addEvent(serviceIndex)}>
                              Add Event
                            </button>

                            {events.map((event, rowIndex) => {
                              const { roleId, cells, time, eventId } = event;

                              const isSelected = selectedEvents.includes(eventId);

                              const tasksDataSet = teammates(
                                data.users,
                                roleId,
                                data.churchId,
                              );
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
                                  {(
                                    provided: DraggableProvided,
                                    snapshot: DraggableStateSnapshot,
                                  ) => (
                                    <TableRow
                                      key={`${serviceIndex}-${rowIndex}`}
                                      hover
                                      onDoubleClick={() =>
                                        handleRowSelected(isSelected, eventId)
                                      }
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
                                        <div {...provided.dragHandleProps}>
                                          <ReorderIcon />
                                        </div>
                                      </TableCell>
                                      {cells.map((cell, columnIndex) => {
                                        const roleDataContext: RoleDataContext = {
                                          serviceIndex,
                                          rowIndex,
                                          roleId,
                                        };
                                        const taskDataContext: TaskDataContext = {
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
                                            options={data.teams}
                                            dataContext={roleDataContext}
                                            onChange={onAssignedRoleChange}
                                            key={`Team_${serviceIndex}_${rowIndex}_${columnIndex}`}
                                            renderOption={renderOption}
                                            isSaved={isSaved}
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
                          </ScheduleTableBody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  );
                })}
              </ScheduleTable>
            </div>
          );
        })}
      </div>

      <Dialog open={isNewScheduleOpen} onClose={() => setIsNewScheduleOpen(false)}>
        <NewScheduleForm
          onClose={() => setIsNewScheduleOpen(false)}
          onSubmit={(newScheduleData) =>
            createSchedule.mutate({ ...newScheduleData, churchId: data.churchId })
          }
          error={createSchedule.error}
        />
      </Dialog>
      {/* <Dialog open={isNewServiceOpen} onClose={() => setIsNewServiceOpen(false)}>
        <NewServiceForm
          onSubmit={(newInfo) =>
            // createService.mutate({
            //   ...newInfo,
            //   scheduleId: tabs[tab].id,
            //   order: dataModel.schedules[tab].services.length + 1, // need a better way to grab scheduleId and order
            // })
            addService()
          }
          onClose={() => setIsNewServiceOpen(false)}
          error={createService.error}
        />
      </Dialog> */}
      <ConfirmationDialog
        title={warningDialogConfig[warningDialog]?.title}
        state={!!warningDialog}
        handleClick={(accepted) => {
          if (accepted) warningDialogConfig[warningDialog]?.accepted();
          else setWarningDialog('');
        }}
      />
    </>
  );
};

interface ScheduleTableInterface {
  columns: ColumnsInterface[];
  role: RoleData;
  title: string;
  view: string;
  services: ServiceDataInterface[];
}

interface RoleData {
  churchId: number;
  createdAt?: string;
  updatedAt?: string;
  id: number;
  name: string;
  roleId: null; // TODO: remove from db
}

interface ColumnsInterface {
  Header: string;
  Accessor: string;
}

interface ServiceData {
  day: number;
  name: string;
  serviceId: number;
  order?: number;
}

interface ServiceDataInterface extends ServiceData {
  events: EventsDataInterface[];
}

interface EventData {
  eventId: number;
  roleId: number;
  time: string;
  order?: number;
}

interface EventsDataInterface extends EventData {
  cells: AssignmentDataInterface[];
}

interface AssignmentDataInterface {
  // we need a better system than this to differentiate cells that display time, and cells that are dynamic
  role?: RoleAssociation;
  display?: string;
  time?: string;
  taskId?: number;
  date?: string;
  firstName?: string;
  lastName?: string;
  userId: number;
}

interface RoleAssociation {
  id: number;
  name: string;
}

export interface UsersDataInterface {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  church: ChurchInterface;
  churchId: number;
  disabled: boolean;
  teams: TeamsInterface[];
}
interface ChurchInterface {
  name: string;
}

interface TeamsInterface {
  id: number;
  name: string;
  users: Teammates[];
}

interface Teammates {
  id: number;
  roleId: number;
  teamLead: boolean;
  user: UserInterface;
}

interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
}

interface TemplateChangesInterface {
  changesSeed: number;
}

interface TeamsDataInterface {
  id: number;
  name: string;
  users: UserRolesInterface[];
}

interface UserRolesInterface {
  id: number;
  roleId: number;
  teamLead: boolean;
  user: UserInterface;
}

interface DataContext {
  serviceIndex: number;
  rowIndex: number;
}

export interface RoleDataContext extends DataContext {
  roleId: number;
}

export interface TaskDataContext extends DataContext {
  taskId: number;
  roleId: number;
  columnIndex: number;
}
