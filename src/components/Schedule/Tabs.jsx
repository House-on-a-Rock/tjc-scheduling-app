import React from 'react';
import PropTypes from 'prop-types';

import Tab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import {
  tabGroupTheme,
  tabTheme,
  tabIndicatorTheme,
  buttonTheme,
} from '../../shared/styles/theme';

export const Tabs = ({ tabs, tabIndex, onTabClick, handleAddClicked }) => {
  const classes = useStyles();
  /* 1) Add an arrow into the tab that opens context menu */
  /* 2) Options in this context menu: rename schedule, delete schedule, color/style tabs */
  return (
    <div className={classes.scheduleTabs}>
      <MuiTabs
        value={tabIndex}
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
      </MuiTabs>
    </div>
  );
};

const useStyles = makeStyles(() =>
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

Tabs.propTypes = {
  tabs: PropTypes.array,
  tabIndex: PropTypes.number,
  onTabClick: PropTypes.func,
  handleAddClicked: PropTypes.func,
};

export default Tabs;
