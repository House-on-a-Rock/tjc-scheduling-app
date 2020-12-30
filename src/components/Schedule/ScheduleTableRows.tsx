/* eslint-disable react/no-array-index-key */
import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { DataCell } from './TableCell';

export const ScheduleTableRows = ({ service, onTaskModified, users }: any) => {
  const classes = useStyles();
  const eventRows = service.events.map((event: any, rowIndex: number) => {
    const potentialMembers = users.filter((user: any) =>
      user.teams.some((role: any) => role.id === event.roleId),
    );
    const eventCells = event.cells.map((cell: any, columnIndex: number) => {
      return columnIndex < 2 ? (
        <TableCell key={`${rowIndex}_${columnIndex}`} className={classes.cell}>
          {cell.display}
        </TableCell>
      ) : (
        <DataCell
          data={cell}
          options={potentialMembers}
          onTaskModified={onTaskModified}
          key={`${rowIndex}_${columnIndex}`}
        />
      );
    });

    return (
      <TableRow key={`${service.name}_${service.serviceId}_${event.eventId}_${rowIndex}`}>
        {eventCells}
      </TableRow>
    );
  });
  return <>{eventRows}</>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cell: {
      // color: typographyTheme.common.color,
      textAlign: 'center',
      '&:focus': {
        outline: 'none',
      },
      padding: '1px 0px 2px 0px',
      height: 20,
      width: 50,
      fontSize: 14,
    },
  }),
);
