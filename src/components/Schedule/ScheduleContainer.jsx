import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ScheduleMain from './ScheduleMain';
import ScheduleTabs from './Tabs';
import NewScheduleForm from '../shared/NewScheduleForm';
import { Alert } from '../shared/Alert';
import useScheduleContainerData from '../../hooks/containerHooks/useScheduleContainerData';

import { createStyles, makeStyles } from '@material-ui/core';
import { loadingTheme } from '../../shared/styles/theme';

// TODO tab switching doesnt quite work, make sure alert works
// error checking if there are no schedules, make sure delete schedule works

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
    setIsNewScheduleOpen,
    setAlert,
    onDeleteSchedule,
  );

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
          {openedTabs.map((tab) => (
            <ScheduleMain
              churchId={churchId}
              scheduleId={tabs.length > 0 ? tabs[tab].id : null}
              isViewed={tab === viewedTab}
              users={users}
              teams={teams}
              setAlert={setAlert}
              deleteSchedule={deleteSchedule}
              tab={tab}
              key={tab.toString()}
            />
          ))}
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

  function onDeleteSchedule(tab) {
    // pbly need a more elegant solution in the future

    setOpenedTabs([0]);
    setViewedTab(0);
    // for future use mbbe
    // setOpenedTabs((p) => {
    //   const clone = p;
    //   console.log(`clone`, clone);
    //   const i = clone.indexOf(tab);
    //   const next = i > 1 ? i - 1 : 0;
    //   console.log(`next`, next);
    //   clone.splice(i, 1, next);
    //   console.log(`clone`, clone);
    //   return clone;
    // });
    // setViewedTab((p) => (p > 0 ? p - 1 : 0));
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
