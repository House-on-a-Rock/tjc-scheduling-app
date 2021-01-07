/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useRef, useState } from 'react';
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

// move these elsewhere?
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
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  //   const [alert, setAlert] = useState<AlertInterface>();

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
  function deleteRow(rowIndex: number) {
    setWarningDialog(EVENT);
  }
  function insertRow(rowIndex: number) {}

  const teammates = (roleId: number) => {
    // TODO add blank user to available options
    return data.users.filter((user) => user.teams.some((team) => team.id === roleId));
  };

  const warningDialogConfig = {
    // I don't think some of these actions should send you to the first tab
    [SCHEDULE]: {
      title: 'Are you sure you want to delete this schedule? This cannot be undone',
      accepted: () => {
        setTab(0); // maybe this one is ok
        deleteSchedule.mutate({ scheduleId: tabs[tab].id, title: tabs[tab].title });
      },
    },
    [SERVICE]: {
      title: 'Are you sure you want to delete this service?',
      accepted: () => {
        // setTab(0);
        // removeService()
      },
    },
    [EVENT]: {
      title: 'Are you sure you want to delete this event?',
      accepted: () => {
        // deleteEvent.mutate({ eventIds: selectedEvents });
        // eventIds.map((eventId) => deleteEvent.mutate(eventId))
        // removeEvents({ eventIds: selectedEvents });
      },
    },
  };

  const handleRowSelected = (isSelected: boolean, eventId: string) =>
    isSelected
      ? setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
      : setSelectedEvents([...selectedEvents, eventId]);

  // since the data check is handled in the parent component (where data is being queried), I think we should put the loading check there
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
        {!data.schedules && <div style={{ height: '50vh' }}></div>}
        {/* {alert && <Alert alert={alert} unMountAlert={() => setAlert(null)} />} */}
        {data.schedules?.map((schedule: ScheduleTableInterface, idx) => {
          const { columns: headers, services: bodies, title, view } = schedule;
          return (
            // This can be moved out as a "pane" component. But it's a little confusing (from my own exp working on service.tjc.org), so we'll keep this here first until everyone's accustomed to it.
            <div key={idx}>
              {/* Children of this component could possibly be moved into its own component, but until we know better how these components will be used, we won't know how to abstract them properly so for now, we'll keep these header and body components apart */}
              <ScheduleTable key={`${title}-${view}`} title={title} hidden={tab !== idx}>
                {headers.map(({ Header }, index: number) => (
                  <ScheduleTableHeader key={`${Header}_${index}`} header={Header} />
                ))}
                {/* This became pretty nested within each other (as a table is), but like in the above comment, abstraction is only useful when it's reusable. Splitting code into pieces is only helpful if it improves readability, and while it reduces the size of this file, that doesn't mean it'll improve readability with all the prop/function drilling that will be required */}
                {bodies.map((body: ServiceDataInterface, index: number) => {
                  const { day, name, events } = body;
                  return (
                    <ScheduleTableBody
                      key={`${day}-${name}`}
                      title={`${days[day]} ${name}`}
                    >
                      {events.map((event, rowIdx) => {
                        const { roleId, cells, title: cellTitle, time, eventId } = event;
                        const isSelected = selectedEvents.includes(eventId.toString());
                        return (
                          <TableRow
                            key={`${cellTitle}-${time}`}
                            hover
                            onClick={() =>
                              handleRowSelected(isSelected, eventId.toString())
                            }
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
              order: data.schedules[tab].services.length + 1, // need a better way to grab scheduleId and order
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

interface EventsDataInterface {
  cells: AssignmentDataInterface[];
  displayTime: boolean;
  eventId: number; // unsure why eventId in eventsData is not just id
  roleId: number;
  time: string;
  title: string;
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
