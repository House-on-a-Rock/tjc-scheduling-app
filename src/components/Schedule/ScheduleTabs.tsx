import React from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import {
  tabGroupTheme,
  tabTheme,
  tabIndicatorTheme,
  buttonTheme,
} from '../../shared/styles/theme.js';
import { SchedulesDataInterface } from '../../query/types.js';

interface ScheduleTabsProps {
  tabs: SchedulesDataInterface[];
  tabIdx: number;
  onTabClick: (value: number) => void;
  handleAddClicked: () => void;
}

export const ScheduleTabs = ({
  tabs,
  tabIdx,
  onTabClick,
  handleAddClicked,
}: ScheduleTabsProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Tabs
        value={tabIdx}
        onChange={(e, value) => onTabClick(value)}
        textColor="primary"
        centered
        className={classes.tabs}
        TabIndicatorProps={{
          style: {
            ...tabIndicatorTheme,
          },
        }}
      >
        {tabs.map((tabData, index) => (
          <Tab
            // eslint-disable-next-line react/no-array-index-key
            key={`${tabData.title}-${index}`}
            label={tabData.title}
            className={classes.tab}
          />
        ))}
        <Tab icon={<AddIcon />} onClick={() => handleAddClicked()} />
      </Tabs>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '3.5rem',
    },
    tabs: {
      ...tabGroupTheme,
      position: 'fixed',
      width: '100%',
      left: 0,
      top: '4rem',
      paddingTop: '1rem',
      background: 'white',
      zIndex: 100,
    },
    tab: {
      ...tabTheme,
    },
    button: {
      ...buttonTheme,
    },
  }),
);
