import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, createStyles } from '@material-ui/core/styles';

// Styles
import { typographyTheme } from '../../shared/styles/theme';

const TableHeader = ({ headers, title }) => {
  console.log(`headers`, headers);
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow key={`${title} Column header`}>
        {headers.map((cell) => (
          <TableCell className={classes.headerCell} key={`cell_${cell.Header}`}>
            {cell.Header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    headerCell: {
      textAlign: 'center',
      padding: '1px 2px',
      color: typographyTheme.common.color,
      border: normalCellBorder,
      fontWeight: 'bold',
    },
  }),
);

const normalCellBorderColor = 'rgba(234, 234, 234, 1)';
const normalCellBorder = `1px solid ${normalCellBorderColor}`;

TableHeader.propTypes = {
  headers: PropTypes.array,
  title: PropTypes.string,
};

export default TableHeader;
