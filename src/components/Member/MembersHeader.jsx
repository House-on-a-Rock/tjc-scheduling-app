import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import { themeExtension } from '../../shared/styles/theme';

const MembersHeader = ({ localChurch, onSearchChange }) => {
  const classes = useStyles();

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <div className={classes.search} style={{ width: '20%' }}>
        <SearchIcon className={classes.searchIcon} style={{ flex: 1 }} />
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={onSearchChange}
        />
      </div>
      <div className={classes.localChurchName} style={{ textAlign: 'center' }}>
        {localChurch || 'Local Church Name'}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      boxShadow: 'none',
    },
    header: {
      backgroundColor: themeExtension.card.backgroundColor,
    },
    search: {
      position: 'relative',
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: themeExtension.sideBar.backgroundColor,
      color: themeExtension.typography.common.color,
      transition: themeExtension.transition.fast,
      '&:hover': {
        backgroundColor: themeExtension.palette.common.lightBlue,
        color: 'white',
      },
      [theme.breakpoints.up('sm')]: {
        width: '200px',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    localChurchName: {
      fontSize: 25,
      color: themeExtension.typography.common.color,
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    table: {
      minWidth: 650,
    },
  }),
);

MembersHeader.propTypes = {
  localChurch: PropTypes.string,
  onSearchChange: PropTypes.func,
};

export default MembersHeader;
