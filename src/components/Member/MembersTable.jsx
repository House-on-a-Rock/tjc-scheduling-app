import React, { CSSProperties, ChangeEvent, MouseEvent } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import { cardTheme } from '../../shared/styles/theme.js';

export const MembersTable = ({
  selectedRowLength,
  members,
  isSelected,
  handleSelectAll,
  handleSelect,
}) => {
  const classes = useStyles();
  const setIndeterminate =
    !!selectedRowLength && selectedRowLength !== members.length;
  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="members table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={setIndeterminate}
                checked={!!selectedRowLength}
                onChange={(event) => {
                  handleSelectAll(event.target.checked);
                }}
              />
            </TableCell>
            <TableCell style={styleHead}>First&nbsp;Name</TableCell>
            <TableCell style={styleHead} align="left">
              Last&nbsp;Name
            </TableCell>
            <TableCell style={styleHead} align="left">
              Email
            </TableCell>
            <TableCell style={styleHead} align="left">
              Disabled
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((row) => {
            const { userId: id, firstName, lastName, email, disabled } = row;
            const isItemSelected = isSelected(id);
            return (
              <TableRow
                hover
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelect(event.shiftKey, row);
                }}
                selected={isItemSelected}
                key={id}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={isItemSelected} />
                </TableCell>
                <TableCell component="th" variant="body" scope="row">
                  {firstName}
                </TableCell>
                <TableCell component="th" variant="body" scope="row" align="left">
                  {lastName}
                </TableCell>
                <TableCell component="th" variant="body" scope="row" align="left">
                  {email}
                </TableCell>
                <TableCell component="th" variant="body" scope="row" align="left">
                  {/* this should be a switch */}
                  {disabled.toString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const styleHead = {
  fontWeight: 'bold',
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: cardTheme.backgroundColor,
      boxShadow: cardTheme.boxShadow,
    },
    table: {
      minWidth: 650,
    },
  }),
);
