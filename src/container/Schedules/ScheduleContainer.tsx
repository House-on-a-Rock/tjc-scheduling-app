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
  AutocompleteCell,
  TimeCell,
} from '../../components/Schedule';
import { ContextMenu, ConfirmationDialog } from '../../components/shared';

import { days } from './utilities';

import {
  useCreateSchedule,
  useDeleteSchedule,
  useCreateService,
  useDeleteEvent,
} from '../utilities/useMutations';

interface BootstrapData {
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
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState<boolean>(false);
  const [isNewServiceOpen, setIsNewServiceOpen] = useState<boolean>(false);
  const [warningDialog, setWarningDialog] = useState<string>('');
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  //   const [alert, setAlert] = useState<AlertInterface>();

  // manipulate events
  const [dataModel, setDataModel] = useState<any>({ ...data });
  const [isStructureModified, setIsStructureModified] = useState<boolean>(false);
  const templateChanges = useRef<TemplateChangesInterface>({
    changesSeed: 0,
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

  function onChangeTabs(value: number) {
    if (value === tabs.length) return;
    // fetchSchedule(value);
    setTab(value);
  }
  // Save Data
  function onTaskModified(taskId: number, newAssignee: number, isChanged: boolean) {
    if (isChanged) {
      const updatedChangedTasks = { ...changedTasks.current, [taskId]: newAssignee };
      changedTasks.current = updatedChangedTasks;
    } else if (changedTasks.current[taskId]) delete changedTasks.current[taskId];

    setIsScheduleModified(Object.keys(changedTasks.current).length > 0);
  }
  function onSaveScheduleChanges() {
    setIsScheduleModified(false);
  }

  // Context Menu functions
  function insertRow() {}
  // delete row

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

  const blankService = {
    name: 'test',
    day: 0,
    events: [],
    serviceId: retrieveChangesSeed(),
  };
  const blankTask = {
    dataContext: retrieveChangesSeed(),
    data: 0,
    dataSet: [{ firstName: '', lastName: '' }],
  };

  const blankEvent = (cellLength: number) => {
    const taskCells: any = [
      { time: 'test PM' },
      { display: 'test', role: { id: 4, name: 'interpreter' } },
    ];
    for (let i = 2; i < cellLength; i++) {
      taskCells[i] = blankTask;
    }
    return {
      cells: [...taskCells],
      eventId: retrieveChangesSeed(),
      roleId: -1,
      time: '',
      title: '',
    };
  };

  function retrieveChangesSeed() {
    // used to give temporary seeds to newly made (but unsaved) events/services. they are negative to distinguish from normal stuff from db
    // also can keep be used to keep track of number of changes made
    // its in a useRef right now, not sure if it needs to be there. But templateChanges will be used for a lot so idk
    return templateChanges.current.changesSeed--;
  }

  function dataModelDiff() {
    // check id, name, and order of events
    // any modified events are added to appropriate prop in templateChanges ref
  }

  function addEvent(serviceIndex: number) {
    const dataClone = { ...dataModel };
    const targetEvents = dataClone.schedules[tab].services[serviceIndex].events;
    const newEvent = blankEvent(dataClone.schedules[tab].columns.length);
    targetEvents.push(newEvent);
    setDataModel(dataClone);
    // run diff function
  }

  function deleteRow() {
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
    retrieveChangesSeed(); // called just to update changesSeed. mbbe not necessary
  }

  function addService() {
    const dataClone = { ...dataModel };
    const target = dataClone.schedules[tab].services;
    target.push(blankService);
    setDataModel(dataClone);
  }

  function deleteService(serviceId: number) {
    const dataClone = { ...dataModel };
    const filteredServices = dataClone.schedules[tab].services.filter(
      (service) => service.serviceId !== serviceId,
    );
    dataClone.schedules[tab].services = filteredServices;
    setDataModel(dataClone);
  }

  function changeTime(newValue: string, rowIndex: number, serviceIndex: number) {
    const dataClone = { ...dataModel };
    dataClone.schedules[tab].services[serviceIndex].events[rowIndex].time = newValue;
    setDataModel(dataClone);
  }

  function isDisplayTime(time: string, rowIndex: number, serviceIndex: number): boolean {
    if (rowIndex === 0) return true;
    const previousEventsTime =
      dataModel.schedules[tab].services[serviceIndex].events[rowIndex - 1].time;
    return previousEventsTime !== time;
  }

  // AUTOCOMPLETE
  function renderOption(display, isIconVisible) {
    return (
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
  // functions for names autocomplete
  const teammates = (roleId: number) => {
    // TODO add blank user to available options
    return data.users.filter((user) => user.teams.some((team) => team.id === roleId));
  };
  function extractTeammateIds(teammates) {
    return teammates.map((teammate) => teammate.userId);
  }
  function processUserData(option: number, dataSet) {
    if (dataSet) {
      const { firstName, lastName } = dataSet.filter((user) => user.userId === option)[0];
      return `${firstName} ${lastName}`;
    }
    return '';
  }

  // functions for roles autocomplete
  function extractRoleIds() {
    return dataModel.teams.map((team) => team.id);
  }
  function onAssignedRoleChange() {
    console.log('role changed');
  }
  function processRoleData(option, dataSet) {
    const filteredData = dataSet.filter((role) => role.id === option)[0];
    if (filteredData) return `${filteredData.name}`;
    return '';
  }

  console.log('data', data);

  return (
    <>
      <div ref={outerRef}>
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
          destroySchedule={() => setWarningDialog(SCHEDULE)} // this function should actually be moved into tabs. when a user right clicks the tab, you'd expect the delete functionality to be there**
          isScheduleModified={isScheduleModified}
          onSaveScheduleChanges={onSaveScheduleChanges}
        />
        <ContextMenu
          outerRef={outerRef}
          addRowHandler={insertRow}
          deleteRowHandler={deleteRow}
        />
        <Prompt
          when={isScheduleModified}
          message="You have unsaved changes, are you sure you want to leave? Unsaved changes will be lost"
        />
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
                {headers.map(({ Header }, index: number) => (
                  <ScheduleTableHeader key={`${Header}_${index}`} header={Header} />
                ))}
                {services.map((body: ServiceDataInterface, serviceIndex: number) => {
                  const { day, name, events, serviceId } = body;
                  return (
                    <ScheduleTableBody
                      key={`${day}-${name}`}
                      title={`${days[day]} ${name}`}
                    >
                      <button onClick={() => deleteService(serviceId)}>
                        Delete Service
                      </button>
                      <button onClick={() => addEvent(serviceIndex)}>Add Event</button>

                      {events.map((event, rowIdx) => {
                        const { roleId, cells, title: cellTitle, time, eventId } = event;
                        const isSelected = selectedEvents.includes(eventId);
                        const dataSet = teammates(roleId);
                        return (
                          <TableRow
                            key={`${cellTitle}-${time}-${rowIdx}`}
                            hover
                            onDoubleClick={() => handleRowSelected(isSelected, eventId)}
                            selected={isSelected}
                          >
                            {cells.map((cell, columnIndex) => {
                              return columnIndex === 0 ? (
                                <TimeCell
                                  time={time}
                                  isDisplayed={isDisplayTime(time, rowIdx, serviceIndex)}
                                  onChange={changeTime}
                                  rowIndex={rowIdx}
                                  serviceIndex={serviceIndex}
                                  key={`Time_${serviceIndex}_${rowIdx}`}
                                />
                              ) : columnIndex === 1 ? (
                                <AutocompleteCell
                                  dataId={roleId}
                                  dataSet={dataModel.teams}
                                  optionIds={extractRoleIds()}
                                  dataContext={eventId}
                                  onTaskModified={onAssignedRoleChange}
                                  key={`Team_${rowIdx}_${columnIndex}`}
                                  determineDisplay={processRoleData}
                                  renderOption={renderOption}
                                />
                              ) : (
                                <AutocompleteCell
                                  dataId={cell.userId}
                                  dataSet={dataSet}
                                  optionIds={extractTeammateIds(dataSet)}
                                  dataContext={cell.taskId}
                                  onTaskModified={onTaskModified}
                                  key={`Tasks_${rowIdx}_${columnIndex}`}
                                  determineDisplay={processUserData}
                                  renderOption={renderOption}
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
  roleId: null; // we gotta remove this
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
  title: string;
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
