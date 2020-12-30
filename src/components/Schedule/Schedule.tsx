/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { CircularProgress, Dialog, TableCell, TableRow } from '@material-ui/core';
import { SchedulesDataInterface } from '../../query';
import { ScheduleTabs } from './ScheduleTabs';
import { ScheduleTable } from './ScheduleTable';
import { NewScheduleForm } from './NewScheduleForm';
import { ScheduleTableHeader } from './ScheduleTableHeader';
import { ScheduleTableBody } from './ScheduleTableBody';
import { ScheduleToolbar } from './ScheduleToolbar';
import { NewServiceForm } from './NewServiceForm';
import {
  DeleteScheduleProps,
  HttpErrorProps,
  NewScheduleData,
  NewServiceData,
} from '../../shared/types';
import { ContextMenu } from '../shared/ContextMenu';
import { days } from '../../shared/utilities';
import { DataCell } from './TableCell';

interface BootstrapData {
  schedules: ScheduleTableInterface[];
  users: UsersDataInterface[];
}
interface ContainerStateProp {
  data: BootstrapData;
  isLoading: boolean;
  error: HttpErrorProps;
  isSuccess: string;
}

interface ScheduleProps {
  tabs: SchedulesDataInterface[];
  state: ContainerStateProp;
  addSchedule: (newInfo: NewScheduleData) => void;
  addService: (newInfo: NewServiceData) => void;
  removeSchedule: (info: DeleteScheduleProps) => void;
}

// Task List
// 1. When the container has more than 3 tabs, when you select the 4th, how to handle data from data handler
// 2. Need to update changedTask and the buttons to reflect only on the schedule selected
// 3. Cell data poorly describes the different kinds of cells that exist. The data structure needs a revamp, and so does the Tablecell/Datacell
// 4. Low priority but finding scheduleId and order is a pain the way I have it currently implemented because allScheduleData exists in tabs, but singular schedule data exist in schedules. Need to consolidate some of the logic together

export const Schedule = ({
  tabs,
  state,
  addSchedule,
  removeSchedule,
  addService,
}: ScheduleProps) => {
  const { isLoading, error, data, isSuccess } = state;
  const [tab, setTab] = useState(0);
  const [isScheduleModified, setIsScheduleModified] = useState<boolean>(false);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState<boolean>(false);
  const [isNewServiceOpen, setIsNewServiceOpen] = useState<boolean>(false);
  //   const [alert, setAlert] = useState<AlertInterface>();

  const changedTasks = useRef<any>({});
  const outerRef = useRef(null);

  // Schedule
  function onChangeTabs(value: number) {
    if (value === tabs.length) return;
    // fetchSchedule(value);
    // I think I need to wait for data to refetch, can't test until we have more schedules to work with
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

  // Service Body
  function deleteRow(rowIndex: number) {}
  function insertRow(rowIndex: number) {}

  useEffect(() => {
    // with react-query, there is no awaiting for a response to finish. so the results need to be handled by the mutations.isSuccess/isError/etc methods in data handler
    if (isSuccess === 'NewScheduleForm') {
      setIsNewScheduleOpen(false);
      setTab(tabs.length);
    }
    if (isSuccess === 'NewServiceForm') setIsNewServiceOpen(false);
    if (isSuccess === 'DeleteSchedule') {
      // setIsNewScheduleOpen(false);
      setTab(0);
    }
    if (isSuccess === 'DeleteService') {
      // setIsNewScheduleOpen(false);
    }
  }, [isSuccess]);

  const teammates = (roleId) =>
    data.users.filter((user) => user.teams.some((team) => team.id === roleId));

  return (
    <>
      {data?.schedules && data?.users && !isLoading ? (
        <>
          <ScheduleTabs
            tabIdx={tab}
            onTabClick={onChangeTabs}
            tabs={tabs}
            handleAddClicked={() => setIsNewScheduleOpen(true)}
          />
          <ScheduleToolbar
            handleNewServiceClicked={() => setIsNewServiceOpen(true)}
            destroySchedule={() =>
              removeSchedule({ scheduleId: tabs[tab].id, title: tabs[tab].title })
            }
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
          {data.schedules?.map((schedule: ScheduleTableInterface, idx) => {
            const { columns: headers, services: bodies, title, view } = schedule;
            return (
              // This can be moved out as a "pane" component. But it's a little confusing (from my own exp working on service.tjc.org), so we'll keep this here first until everyone's accustomed to it.
              <div key={idx}>
                {/* Children of this component could possibly be moved into its own component, but until we know better how these components will be used, we won't know how to abstract them properly so for now, we'll keep these header and body components apart */}
                <ScheduleTable
                  key={`${title}-${view}`}
                  title={title}
                  hidden={tab !== idx}
                >
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
                          const { roleId, cells, title: cellTitle, time } = event;
                          return (
                            <TableRow key={`${cellTitle}-${time}`}>
                              {cells.map((cell, columnIndex) =>
                                columnIndex < 2 ? (
                                  <TableCell key={`${rowIdx}_${columnIndex}`}>
                                    {cell.display}
                                  </TableCell>
                                ) : (
                                  <DataCell
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
        </>
      ) : (
        <CircularProgress />
      )}
      <Dialog open={isNewScheduleOpen} onClose={() => setIsNewScheduleOpen(false)}>
        <NewScheduleForm
          onClose={() => setIsNewScheduleOpen(false)}
          onSubmit={(newScheduleData) => addSchedule(newScheduleData)}
          error={error}
        />
      </Dialog>
      <Dialog open={isNewServiceOpen} onClose={() => setIsNewServiceOpen(false)}>
        <NewServiceForm
          onSubmit={(newInfo) =>
            addService({
              ...newInfo,
              scheduleId: tabs[tab].id,
              order: data.schedules[tab].services.length + 1, // need a better way to grab scheduleId and order
            })
          }
          onClose={() => setIsNewServiceOpen(false)}
          error={error}
        />
      </Dialog>
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
  eventId: number;
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

interface UsersDataInterface {
  church: ChurchInterface;
  churchId: number;
  disabled: boolean;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
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
