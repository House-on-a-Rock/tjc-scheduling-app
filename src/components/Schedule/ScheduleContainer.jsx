import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ScheduleMain from './ScheduleMain';
import ScheduleTabs from './Tabs';
import NewScheduleForm from '../shared/NewScheduleForm';
import { Alert, sendAlert } from '../shared/Alert';
import useScheduleContainerData from '../../hooks/containerHooks/useScheduleContainerData';

import { createStyles, makeStyles } from '@material-ui/core';
import { loadingTheme } from '../../shared/styles/theme';

// error checking if there are no schedules

const ScheduleContainer = ({ churchId }) => {
  const classes = useStyles();
  const [viewedTab, setViewedTab] = useState(0);
  const [openedTabs, setOpenedTabs] = useState([0]);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  const [
    loaded,
    tabs,
    users,
    teams,
    createSchedule,
    deleteSchedule,
  ] = useScheduleContainerData(
    churchId,
    setAlert,
    onCreateScheduleSuccess,
    onDeleteScheduleSuccess,
  );

  console.log(users);
  // TODO solution for when theres no schedules/tabs

  return (
    <div className={!loaded ? classes.loading : ''}>
      {loaded && (
        <div>
          <ScheduleTabs
            tabIndex={viewedTab}
            onTabClick={onTabClick}
            handleAddClicked={() => setIsNewScheduleOpen(true)}
            tabs={tabs}
          />
          {openedTabs.length > 0 ? (
            openedTabs.map((tab) => (
              <ScheduleMain
                churchId={churchId}
                scheduleId={tabs.length > 0 ? tabs[tab].id : null}
                isVisible={tab === viewedTab}
                users={users}
                teams={teams}
                setAlert={setAlert}
                deleteSchedule={deleteSchedule}
                tab={tab}
                key={tab.toString()}
              />
            ))
          ) : (
            <div>Create a new schedule!</div>
          )}
          {isNewScheduleOpen && (
            <NewScheduleForm
              onClose={() => setIsNewScheduleOpen(false)}
              isOpen={isNewScheduleOpen}
              onSubmit={(newScheduleData) =>
                createSchedule.mutate({ ...newScheduleData, churchId: churchId })
              }
              error={createSchedule.error}
            />
          )}
          {alert && (
            <Alert alert={alert} isOpen={!!alert} handleClose={() => setAlert(null)} />
          )}
        </div>
      )}
    </div>
  );

  function onCreateScheduleSuccess(res) {
    setIsNewScheduleOpen(false);
    setAlert(sendAlert(res));

    const newTab = tabs.length;
    setOpenedTabs((t) => [...t, newTab]);
    setViewedTab(newTab);
  }

  function onDeleteScheduleSuccess(tab) {
    const isFirstTab = tab === 0;
    const nextTab = tab > 0 ? tab - 1 : 0;

    setViewedTab(nextTab);
    setOpenedTabs((t) => {
      const clone = [...t];
      if (!isFirstTab) {
        const tabIndex = clone.indexOf(tab);
        const isNextExist = clone.indexOf(nextTab);
        if (isNextExist >= 0) clone.splice(tabIndex, 1);
        else clone.splice(tabIndex, 1, nextTab);
        const clone2 = clone.map((item) => (item > nextTab ? item - 1 : item));
        return clone2;
      } else {
        if (t.length === 1) return [0];
        const next = t.map((index) => index - 1);
        next.splice(0, 1);
        return next.length > 0 ? next : [0];
      }
    });
  }

  function onTabClick(value) {
    if (value <= tabs.length - 1) {
      const isOpened = openedTabs.indexOf(value);
      if (isOpened < 0) setOpenedTabs([...openedTabs, value]); // adds unopened tabs to array. need way to handle lots of tabs
      setViewedTab(value);
    } else setIsNewScheduleOpen(true); // if last tab, open dialog to make new schedule
  }
};

const useStyles = makeStyles(() =>
  createStyles({
    loading: {
      ...loadingTheme,
    },
  }),
);

ScheduleContainer.propTypes = {
  churchId: PropTypes.number,
};

export default ScheduleContainer;
