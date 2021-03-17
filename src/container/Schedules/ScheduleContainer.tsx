/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
import React, { useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { Dialog, TableRow } from '@material-ui/core';
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

import {
  days,
  extractRoleIds,
  getRoleOptionLabel,
  getUserOptionLabel,
  extractTeammateIds,
  teammates,
  createBlankEvent,
} from './utilities';

import {
  useCreateSchedule,
  useDeleteSchedule,
  useCreateService,
  useDeleteEvent,
} from '../utilities/useMutations';

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
  const [dataModel, setDataModel] = useState<BootstrapData>(data);
  const templateChanges = useRef<TemplateChangesInterface>({
    changesSeed: -1,
    events: {
      changedEvents: null,
      newEvents: null,
      deletedEvents: null,
    },
    services: {
      changedServices: null,
      newServices: null,
      deletedServices: null,
    },
  });

  const changedTasks = useRef<any>({});
  const outerRef = useRef(null);

  const createSchedule = useCreateSchedule(setIsNewScheduleOpen);
  const deleteSchedule = useDeleteSchedule(setWarningDialog);
  const createService = useCreateService(setIsNewServiceOpen);
  const deleteEvent = useDeleteEvent();

  React.useEffect(() => {
    setDataModel(data);
  }, [data]);

  function onSaveScheduleChanges() {
    /*
    For next PR
      1. check if templateChanges.changesSeed < 0
        a. if there are changes, prompt if they want to save schedule changes to a new template
        b. if not, run saveChanges() on changedTasks, display alert
      If there are template changes
        1. run diffing function, then useMutation          
        2. onMutationSuccess, clear changes, reset changesSeed
    
      
      Diffing function - need to check for changes in order, will do that next PR
        1. check if services match up

      Currently, still unable to save changes to DB, coming soonTM
    */
    setIsScheduleModified(false);
  }

  // Context Menu functions
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
    // used to give temporary seeds to newly made (but unsaved) events/services. they are negative to distinguish from normal stuff from db
    // also can keep be used to keep track of number of changes made, kinda
    // its in a useRef right now, not sure if it needs to be there. But templateChanges will be used for a lot so idk
    return templateChanges.current.changesSeed--;
  }

  function dataModelDiff() {
    // check id, name, and order of events
    // any modified events are added to appropriate prop in templateChanges ref
    // should this be called after every change or only onSaveChanges? changedTasks is tracked as each one is updated, but that's much simpler to run
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
    const dataClone = { ...dataModel };
    const targetEvents = dataClone.schedules[tab].services[serviceIndex].events;
    const newEvent = createBlankEvent(
      dataClone.schedules[tab].columns.length,
      retrieveChangesSeed,
    );
    targetEvents.push(newEvent);
    setDataModel(dataClone);
  }

  function removeEvent() {
    // TODO: make sure it works once contextmenu is fixed
    const dataClone = { ...dataModel };
    const target = dataClone.schedules[tab];
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
    const dataClone = { ...dataModel };
    const target = dataClone.schedules[tab].services;
    target.push(createBlankService());
    setDataModel(dataClone);
  }

  function deleteService(serviceId: number) {
    const dataClone = { ...dataModel };
    const filteredServices = dataClone.schedules[tab].services.filter(
      (service) => service.serviceId !== serviceId,
    );
    dataClone.schedules[tab].services = filteredServices;
    setDataModel(dataClone);
    retrieveChangesSeed();
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
      dataModel.schedules[tab].services[serviceIndex].events[rowIndex - 1].time;
    return previousEventsTime !== time;
  }

  // onChange Handlers
  function onTaskChange(dataContext, newAssignee: number) {
    const { taskId, serviceIndex, rowIndex, columnIndex } = dataContext;
    const dataClone = { ...dataModel };
    dataClone.schedules[tab].services[serviceIndex].events[rowIndex].cells[
      columnIndex
    ].userId = newAssignee;
    setDataModel(dataClone);
    // May be used in future
    // if (isChanged) {
    //   const updatedChangedTasks = { ...changedTasks.current, [taskId]: newAssignee };
    //   changedTasks.current = updatedChangedTasks;
    // } else if (changedTasks.current[taskId]) delete changedTasks.current[taskId];
    // setIsScheduleModified(Object.keys(changedTasks.current).length > 0);
  }

  function onAssignedRoleChange(dataContext, newRoleId) {
    const { serviceIndex, rowIndex } = dataContext;
    const dataClone = { ...dataModel };
    const targetEvent = dataClone.schedules[tab].services[serviceIndex].events[rowIndex];
    targetEvent.roleId = newRoleId;

    setDataModel(dataClone);
  }

  function onTimeChange(newValue: string, rowIndex: number, serviceIndex: number) {
    const dataClone = { ...dataModel };
    dataClone.schedules[tab].services[serviceIndex].events[rowIndex].time = newValue;
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
        {!data.schedules && <div style={{ height: '50vh' }}></div>}
        {/* {alert && <Alert alert={alert} unMountAlert={() => setAlert(null)} />} */}
        {dataModel.schedules.map((schedule: ScheduleTableInterface, scheduleIndex) => {
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
                    <ScheduleTableBody
                      key={`ScheduleTableBody-${name}`}
                      title={`${days[day]} ${name}`}
                    >
                      <button onClick={() => deleteService(serviceId)}>
                        Delete Service
                      </button>
                      <button onClick={() => addEvent(serviceIndex)}>Add Event</button>

                      {events.map((event, rowIndex) => {
                        const { roleId, cells, time, eventId } = event;

                        const isSelected = selectedEvents.includes(eventId);

                        const tasksDataSet = teammates(
                          dataModel.users,
                          roleId,
                          data.churchId,
                        );
                        const isTimeDisplayed = shouldDisplayTime(
                          time,
                          rowIndex,
                          serviceIndex,
                        );

                        return (
                          <TableRow
                            key={`${serviceIndex}-${rowIndex}`}
                            hover
                            onDoubleClick={() => handleRowSelected(isSelected, eventId)}
                            selected={isSelected}
                          >
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
                                  key={`Time_${serviceIndex}_${rowIndex}`}
                                />
                              ) : columnIndex === 1 ? (
                                <DutyAutocomplete
                                  dataId={roleId}
                                  dataSet={dataModel.teams}
                                  extractOptionId={extractRoleIds}
                                  dataContext={roleDataContext}
                                  onChange={onAssignedRoleChange}
                                  key={`Team_${serviceIndex}_${rowIndex}_${columnIndex}`}
                                  getOptionLabel={getRoleOptionLabel}
                                  renderOption={renderOption}
                                  isSaved={isSaved}
                                />
                              ) : (
                                <TasksAutocomplete
                                  dataId={cell.userId}
                                  roleId={roleId}
                                  dataSet={tasksDataSet}
                                  extractOptionId={extractTeammateIds}
                                  dataContext={taskDataContext}
                                  onChange={onTaskChange}
                                  getOptionLabel={getUserOptionLabel}
                                  renderOption={renderOption}
                                  // isSaved={isSaved}
                                  key={`Tasks_${serviceIndex}_${rowIndex}_${columnIndex}`}
                                />
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </ScheduleTableBody>
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
  events: {
    changedEvents: EventData[];
    newEvents: EventData[];
    deletedEvents: EventData[];
  };
  services: {
    changedServices: ServiceData[];
    newServices: ServiceData[];
    deletedServices: ServiceData[];
  };
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
