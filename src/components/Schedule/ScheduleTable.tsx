import React, { ReactNode } from 'react';

// Material UI
import MaUTable from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, Theme, createStyles, fade, darken } from '@material-ui/core/styles';

// Styles
import { paletteTheme } from '../../shared/styles/theme.js';

interface ScheduleTableProps {
  title: string;
  hidden: boolean;
  children: ReactNode[];
  outerRef?: any;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  title,
  hidden,
  children,
  outerRef,
}) => {
  const classes = useStyles();
  const [header, body] = children;

  return (
    <div className={classes.scheduleTable} style={{ display: hidden ? 'none' : 'block' }}>
      <MaUTable className={classes.table} ref={outerRef ?? null}>
        <TableHead>
          <TableRow key={`${title} Column header`}>{header}</TableRow>
        </TableHead>
        {/* Keep this here in case we want to revert: */}
        {/* <TableBody>{body}</TableBody> */}
        {body}
      </MaUTable>
    </div>
  );
};

const normalCellBorderColor = 'rgba(234, 234, 234, 1)';
const normalCellBorder = `1px solid ${normalCellBorderColor}`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduleTable: {
      position: 'absolute',
      paddingTop: 10,
    },
    table: {
      borderCollapse: 'inherit',
      marginBottom: '1rem',

      // first column:
      '& td:first-child, th:first-child': {
        left: '8px',
        width: '12ch', // need this when there's very few columns
        '& input': {
          width: '12ch',
          textAlign: 'center',
        },
        '&:before': {
          // use a pseudo-element to cover left-side gap when scrolling
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
          // use a pseudo-element to cover right-side gap when scrolling
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
