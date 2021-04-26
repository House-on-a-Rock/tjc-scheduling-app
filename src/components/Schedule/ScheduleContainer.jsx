import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { createStyles, makeStyles } from '@material-ui/core';
import ScheduleMain from './ScheduleMain';
import ScheduleTabs from './Tabs';
import NewScheduleForm from './NewScheduleForm';
import { loadingTheme } from '../../shared/styles/theme';
import useScheduleContainerData from '../../hooks/containerHooks/useScheduleContainerData';

const ScheduleContainer = ({ churchId }) => {
  const classes = useStyles();

  // these are the indices that correlate to the array of scheduleIds retrieved from the DB
  const [tabIndex, setTabIndex] = useState(0);
  const [openedTabs, setOpenedTabs] = useState([0]);

  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);

  const [
    isTabsLoading,
    tabs,
    isUsersLoading,
    users,
    isTeamsLoading,
    teams,
    createSchedule,
  ] = useScheduleContainerData(churchId, setIsNewScheduleOpen);

  // console.log(`tabs, users, teams`, tabs, users, teams);

  const loaded = !isTabsLoading && !isUsersLoading && !isTeamsLoading;

  return (
    <div className={isTabsLoading ? classes.loading : ''}>
      {loaded && (
        <div>
          <ScheduleTabs
            tabIndex={tabIndex}
            onTabClick={onTabClick}
            handleAddClicked={() => setIsNewScheduleOpen(true)}
            tabs={tabs}
          />
          <NewScheduleForm
            onClose={() => setIsNewScheduleOpen(false)}
            isOpen={isNewScheduleOpen}
            onSubmit={(newScheduleData) =>
              createSchedule.mutate({ ...newScheduleData, churchId: churchId })
            }
            error={createSchedule.error}
          />
          {openedTabs.map((tab) => (
            <ScheduleMain
              scheduleId={tabs[tab].id}
              isViewed={tab === tabIndex}
              users={users}
              teams={teams}
              key={tab.toString()}
              // alert stuff
            />
          ))}
        </div>
      )}
    </div>
  );

  function onTabClick(value) {
    if (value <= tabs.length - 1) {
      setTabIndex(value);
      const isOpened = openedTabs.indexOf(value);
      if (isOpened < 0) setOpenedTabs([...openedTabs, value]); // adds unopened tabs to array. need way to handle lots of tabs
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
