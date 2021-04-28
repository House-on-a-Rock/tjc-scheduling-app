import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { createStyles, makeStyles } from '@material-ui/core';
import ScheduleMain from './ScheduleMain';
import ScheduleTabs from './Tabs';
import NewScheduleForm from '../shared/NewScheduleForm';
import { loadingTheme } from '../../shared/styles/theme';
import useScheduleContainerData from '../../hooks/containerHooks/useScheduleContainerData';

// TODO tab switching doesnt quite work, make sure alert works
// error checking if there are no schedules

const ScheduleContainer = ({ churchId }) => {
  const classes = useStyles();
  const [viewedTab, setViewedTab] = useState(0);
  const [openedTabs, setOpenedTabs] = useState([0]);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);

  const [loaded, tabs, users, teams, createSchedule] = useScheduleContainerData(
    churchId,
    setIsNewScheduleOpen,
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
              key={tab.toString()}
              // alert stuff
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
        </div>
      )}
    </div>
  );

  function onTabClick(value) {
    if (value <= tabs.length - 1) {
      setViewedTab(value);
      const isOpened = openedTabs.indexOf(tabs[value]);
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
