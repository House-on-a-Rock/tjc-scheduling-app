import React from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import {
  tabGroupTheme,
  tabTheme,
  tabIndicatorTheme,
  buttonTheme,
} from '../../shared/styles/theme.js';

export const ScheduleTabs = ({
  tabs,
  tabIdx,
  onTabClick,
  handleAddClicked,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.scheduleTabs}>
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
        <Tab
          icon={<AddIcon />}
          className={classes.addTab}
          onClick={() => handleAddClicked()}
        />
      </Tabs>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    scheduleTabs: {
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
    addTab: {
      ...tabTheme,
      minWidth: '7ch',
      '& > span': {
        // hide rightmost divider line without causing shifting:
        borderRightColor: 'transparent !important',
      },
    },
    button: {
      ...buttonTheme,
    },
  }),
);
