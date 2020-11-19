import React from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { ScheduleTabsProps } from '../../../shared/types';
import {
  tabGroupTheme,
  tabTheme,
  tabIndicatorTheme,
} from '../../../shared/styles/theme.js';

const useStyles = makeStyles(() =>
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
      zIndex: 9001,
    },
    tab: {
      ...tabTheme,
    },
  }),
);

export const ScheduleTabs = ({ tabIdx, onTabClick, titles }: ScheduleTabsProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tabs
        value={tabIdx}
        onChange={onTabClick}
        textColor="primary"
        centered
        className={classes.tabs}
        TabIndicatorProps={{
          style: {
            ...tabIndicatorTheme,
          },
        }}
      >
        {titles.map((title) => (
          <Tab key={`ScheduleTabs-${title}`} label={title} className={classes.tab} />
        ))}
        <Tab label={<AddIcon />} className={classes.tab} />
      </Tabs>
    </div>
  );
};
