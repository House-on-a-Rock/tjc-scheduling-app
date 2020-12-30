/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, Dialog } from '@material-ui/core';
import { SchedulesDataInterface } from '../../query';
import { ScheduleTabs } from './ScheduleTabs';
import { AnotherScheduleComponent } from './AnotherScheduleComponent';
import { NewScheduleForm } from './NewScheduleForm';
import { ScheduleTableHeader } from './ScheduleTableHeader';
import { ScheduleTableRows } from './ScheduleTableRows';
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

interface BootstrapData {
  schedules: any;
  users: any;
}
interface ContainerStateProp {
  data: BootstrapData;
  isLoading: boolean;
  error: HttpErrorProps;
  isSuccess: any;
}

interface ScheduleProps {
  tabs?: SchedulesDataInterface[];
  state?: ContainerStateProp;
  addSchedule?: (newInfo: NewScheduleData) => void;
  addService?: (newInfo: NewServiceData) => void;
  removeSchedule?: (info: DeleteScheduleProps) => void;
}

// Task List
// 1. When the container has more than 3 tabs, when you select the 4th, how to handle data from data handler
// 2. Need to update changedTask and the buttons to reflect only on the schedule selected

export const AnotherScheduleContainer = ({
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
          {data.schedules?.map((schedule, idx) => {
            const { columns, services, title, view } = schedule;
            return (
              // This can be moved out as a "pane" component. But it's a little confusing (from my own exp working on service.tjc.org), so we'll keep this here first until everyone's accustomed to it.
              <div key={idx}>
                <AnotherScheduleComponent
                  key={`${title}-${view}`}
                  title={title}
                  hidden={tab !== idx}
                >
                  {/* These children could possibly be moved into its own component, but until we know better how these components will be used, we won't know how to abstract them properly so for now, we'll keep these header and body components apart */}
                  {columns.map((column: any, index: number) => (
                    <ScheduleTableHeader
                      key={`${column.Header}_${index}`}
                      header={column.Header}
                    />
                  ))}
                  {services.map((service: any) => {
                    const { day, name, index } = service;
                    return (
                      <ScheduleTableBody
                        key={`${day}-${name}-${index}`}
                        title={`${days[day]} ${name}`}
                      >
                        <ScheduleTableRows
                          key={`${name}-${day}-tablerow`}
                          service={service}
                          onTaskModified={onTaskModified}
                          users={data.users}
                        />
                      </ScheduleTableBody>
                    );
                  })}
                </AnotherScheduleComponent>
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
