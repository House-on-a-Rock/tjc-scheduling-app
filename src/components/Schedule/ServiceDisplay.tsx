import React, { useState } from 'react';
import { useQuery } from 'react-query';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { DataCell } from './TableCell';

import { extractTokenInfo, days, useToken } from '../../shared/utilities';

// query
import { getChurchMembersData } from '../../query';

export const ServiceDisplay = ({ service, onTaskModified }: any) => {
  const classes = useStyles();
  const token = useToken();

  const churchId = parseInt(token && extractTokenInfo(token, 'churchId')[0], 10);
  const [isChildrenVisible, setChildrenVisible] = useState(true);

  const { isLoading, error, data: userData } = useQuery(
    ['roleData', churchId],
    getChurchMembersData,
    {
      staleTime: 300000,
      cacheTime: 3000000,
    },
  );

  // need a better looking solution
  if (isLoading)
    return (
      <TableRow>
        <TableCell>Loading</TableCell>
      </TableRow>
    ); // prevents problems when using data from useQuery before its arrived from the backend. suggestions welcome

  const frozenColumn = ['time', 'duty'];

  const eventRows = service.events.map((event: any, rowIndex: number) => {
    const potentialMembers = userData.filter((user: any) =>
      user.teams.some((role: any) => role.id === event.roleId),
    );
    const eventCells = event.cells.map((cell: any, columnIndex: number) => {
      return columnIndex < 2 ? (
        // eslint-disable-next-line react/no-array-index-key
        <TableCell key={`${rowIndex}_${columnIndex}`} className={classes.cell}>
          {cell.display}
        </TableCell>
      ) : (
        <DataCell
          data={cell}
          options={potentialMembers}
          onTaskModified={onTaskModified}
          // eslint-disable-next-line react/no-array-index-key
          key={`${rowIndex}_${columnIndex}`}
        />
      );
    });

    return (
      // eslint-disable-next-line react/no-array-index-key
      <TableRow key={`${service.name}_${service.serviceId}_${event.eventId}_${rowIndex}`}>
        {eventCells}
      </TableRow>
    );
  });

  // main return is this one
  return (
    <>
      <TableRow
        onClick={() => {
          setChildrenVisible((d) => !d);
        }}
      >
        <TableCell>{`${days[service.day]} ${service.name}`}</TableCell>
      </TableRow>
      {isChildrenVisible ? (
        eventRows
      ) : (
        <TableRow key={service.serviceId}>placeholder</TableRow>
      )}
    </>
  );
};

// ok styling needs some work
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
