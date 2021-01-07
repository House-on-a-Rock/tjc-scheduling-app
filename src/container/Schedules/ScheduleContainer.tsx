/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
import React, { useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { Dialog, TableCell, TableRow } from '@material-ui/core';
import { SchedulesDataInterface } from '../../query';
import {
  ScheduleTabs,
  ScheduleTable,
  NewScheduleForm,
  ScheduleTableHeader,
  ScheduleTableBody,
  ScheduleToolbar,
  NewServiceForm,
  ScheduleTableCell,
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
  churchId: number;
}

interface ScheduleContainerProps {
  tabs: SchedulesDataInterface[];
  data: BootstrapData;
}

const SERVICE = 'service';
const EVENT = 'event';
const SCHEDULE = 'schedule';

// Task List
// 1. When the container has more than 3 tabs, when you select the 4th, how to handle data from data handler
// 2. Need to update changedTask and the buttons to reflect only on the schedule selected
// 3. Cell data poorly describes the different kinds of cells that exist. The data structure needs a revamp, and so does the Tablecell/Datacell
// 4. Low priority but finding scheduleId and order is a pain the way I have it currently implemented because allScheduleData exists in tabs, but singular schedule data exist in schedules. Need to consolidate some of the logic together

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
  const changedEvents = useRef<ChangedEventsInterface>();

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
  // function deleteRow() {
  //   // setWarningDialog(EVENT);
  //   // mutate dataModel, run diff, add changes to changedEvents
  //   const dataClone = { ...dataModel };
  //   const mutatedData = dataClone.schedules[tab].services.map((service) =>
  //     service.events.filter(({ eventId }) => !selectedEvents.includes(eventId)),
  //   );
  //   console.log('mutatedData', mutatedData);
  //   const updatedDataModel = (dataClone.schedules[tab].services = [...mutatedData]);
  //   setDataModel({ ...updatedDataModel });
  // }

  function insertRow() {}

  const teammates = (roleId: number) => {
    // TODO add blank user to available options
    return data.users.filter((user) => user.teams.some((team) => team.id === roleId));
  };

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

  const blankTask = {
    role: { id: -1, name: '' },
    display: '',
    time: '',
    displayTime: true,
    taskId: -1,
    date: '',
    firstName: '',
    lastName: '',
    userId: -1,
  };

  const blankEvent = (cellLength: number, eventsLength: number) => {
    const taskCells: any = [
      { display: '', time: 'test PM', displayTime: true },
      { display: 'test', role: { id: 4, name: 'interpreter' } },
    ];
    for (let i = 2; i < cellLength; i++) {
      taskCells[i] = blankTask;
    }
    return {
      cells: [...taskCells],
      displayTime: true,
      eventId: -1 * eventsLength,
      roleId: -1,
      time: '',
      title: '',
    };
  };

  // diff function
  function dataModelDiff() {
    // loop through and check id, name, and order of events
    // any modified events are added to appopriate prop in changedEvents ref
  }

  function addEventHandler(
    scheduleIndex: number,
    serviceIndex: number,
    eventsLength: number,
  ) {
    const dataClone = { ...dataModel };
    const targetEvents = dataClone.schedules[scheduleIndex].services[serviceIndex].events;
    targetEvents.push(blankEvent(targetEvents[0]?.cells.length, eventsLength));
    setDataModel(dataClone);
    // run diff function
  }

  function deleteRow() {
    const dataClone = { ...dataModel };
    const targetSchedule = dataClone.schedules[tab];
    const mutatedData = targetSchedule.services.map((service) => {
      return {
        ...service,
        events: service.events.filter(({ eventId }) => !selectedEvents.includes(eventId)),
      };
    });
    targetSchedule.services = mutatedData;
    setDataModel(dataClone);
    // diff
  }

  // goal
  /*
    1. changes to the structure of the schedule are first made to a clone, not directly to db
      a. Add/delete event, add/delete service, renaming time, reassigning duty (drop down)
      b. rearranging events/services
    2. How to check if any of those changes have been made? Is there undo function? or any change made to structure will trigger 'save changes'
      a. separate state for structure changes - save with a separate "save as new template" dialog, or a separate button to do so?
      b. diff function to determine this new state
    3. Reassigning roles -- needs to determine assignable people again. maybe useeffect to listen to dataModel change? 
    4. 
  */

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
          handleNewServiceClicked={() => setIsNewServiceOpen(true)}
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
                  const { day, name, events } = body;
                  console.log('rendering services');
                  return (
                    <ScheduleTableBody
                      key={`${day}-${name}`}
                      title={`${days[day]} ${name}`}
                    >
                      <button
                        onClick={() =>
                          addEventHandler(scheduleIndex, serviceIndex, events.length)
                        }
                      >
                        Add Event
                      </button>
                      {events.map((event, rowIdx) => {
                        const { roleId, cells, title: cellTitle, time, eventId } = event;
                        const isSelected = selectedEvents.includes(eventId);
                        return (
                          <TableRow
                            key={`${cellTitle}-${time}-${rowIdx}`}
                            hover
                            onClick={() => handleRowSelected(isSelected, eventId)}
                            selected={isSelected}
                          >
                            {cells.map((cell, columnIndex) =>
                              columnIndex < 2 ? (
                                <TableCell key={`${rowIdx}_${columnIndex}`}>
                                  {cell.display}
                                </TableCell>
                              ) : (
                                <ScheduleTableCell
                                  data={cell}
                                  options={teammates(roleId)}
                                  onTaskModified={onTaskModified}
                                  key={`${rowIdx}_${columnIndex}`}
                                />
                              ),
                            )}
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
      <Dialog open={isNewServiceOpen} onClose={() => setIsNewServiceOpen(false)}>
        <NewServiceForm
          onSubmit={(newInfo) =>
            createService.mutate({
              ...newInfo,
              scheduleId: tabs[tab].id,
              order: dataModel.schedules[tab].services.length + 1, // need a better way to grab scheduleId and order
            })
          }
          onClose={() => setIsNewServiceOpen(false)}
          error={createService.error}
        />
      </Dialog>
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

interface ServiceDataInterface {
  day: number;
  events: EventsDataInterface[];
  name: string;
  serviceId: number;
}

interface EventData {
  displayTime: boolean;
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
  displayTime?: boolean;
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

interface ChangedEventsInterface {
  changedEvents: EventData[];
  newEvents: EventData[];
  deletedEvents: EventData[];
}
