/* eslint-disable react/no-array-index-key */
import React, { useRef } from 'react';

// Material UI
import MaUTable from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, Theme, createStyles, fade, darken } from '@material-ui/core/styles';

// Styles
import { paletteTheme } from '../../shared/styles/theme.js';

export const AnotherScheduleComponent = ({ title, hidden, children }: any) => {
  const classes = useStyles();
  const [header, body] = children;

  return (
    <div
      className={classes.scheduleComponent}
      style={{ display: hidden ? 'none' : 'block' }}
    >
      <MaUTable className={classes.table}>
        <TableHead>
          <TableRow key={`${title} Column header`}>{header}</TableRow>
        </TableHead>
        <TableBody>{body}</TableBody>
      </MaUTable>
    </div>
  );
};

const normalCellBorderColor = 'rgba(234, 234, 234, 1)';
const normalCellBorder = `1px solid ${normalCellBorderColor}`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduleComponent: {
      position: 'absolute',
      paddingTop: 10,
    },
    table: {
      borderCollapse: 'inherit',
      marginBottom: '1rem',

      // first two columns:
      // '& td:first-child, td:nth-child(2), th:first-child, th:nth-child(2)': {
      //   background: 'white',
      //   position: 'sticky',
      //   zIndex: 1,
      //   border: normalCellBorder,
      //   boxSizing: 'border-box',
      // },

      // first column:
      '& td:first-child, th:first-child': {
        left: '8px',
        width: '12ch', // need this when there's very few columns
        '& input': {
          width: '12ch',
          textAlign: 'center',
        },
        '&:before': {
          content: '""',
          background: 'white',
          position: 'absolute',
          width: '8px',
          top: '-1px',
          left: '-9px',
          height: '106%',
        },
      },

      // second column:
      '& td:nth-child(2), th:nth-child(2)': {
        left: '135px',
        width: '14ch', // need this when there's very few columns
        '& input': {
          width: '14ch',
        },
        borderRightWidth: 0,
        '&:after': {
          content: '""',
          background: fade(paletteTheme.common.lightBlue, 0.15),
          position: 'absolute',
          width: '5px',
          top: '-1px',
          left: 'calc(100% - 2.5px)',
          height: '106%',
        },
      },

      // third column:
      '& td:nth-child(3), th:nth-child(3)': {
        borderLeftWidth: 0,
      },

      // last row:
      '& tr:last-child td': {
        borderBottomWidth: '2px',
        borderBottomColor: darken(normalCellBorderColor, 0.25),
      },
    },
  }),
);
