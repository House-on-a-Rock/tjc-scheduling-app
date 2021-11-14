import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { TableCell, TableRow, TableBody as MuiTableBody } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

// TODO when collapsing, use css to hide instead of js?

export const TableBody = ({
  title,
  serviceId,
  children,
  providedRef,
  isEdit,
  addEvent,
  deleteService,
  onEditService,
}) => {
  const tooltipId = `${title}_tooltip`;
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  return (
    <MuiTableBody ref={providedRef}>
      <TableRow>
        <TableCell className={classes.scheduleTitle}>
          <div data-tip data-for={tooltipId} onClick={() => setOpen(!open)}>
            {title}
          </div>
          <div className={isEdit ? classes.visibleEdit : classes.invisibleEdit}>
            <EditIcon onClick={() => onEditService(serviceId)} />
            <button onClick={deleteService}>Delete Service</button>
            <button onClick={addEvent}>Add Event</button>
          </div>
          <ReactTooltip id={tooltipId}>
            <span>{`Click to ${open ? 'collapse' : 'expand'}`}</span>
          </ReactTooltip>
        </TableCell>
      </TableRow>
      {open && children}
    </MuiTableBody>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    scheduleTitle: {},
    groupOfRows: {
      transition: 'transform 0.2s, visibility 0.15s',
      transformOrigin: 'top',
      width: '20ch',
    },
    collapsedGroupOfRows: {
      transform: 'scaleY(0)',
      visibility: 'collapse',
      opacity: 0.5,
      pointerEvents: 'none',
    },
    expandedGroupOfRows: {
      animation: `$flashOfColor 0.25s ${theme.transitions.easing.easeInOut}`,
    },
    '@keyframes flashOfColor': {
      '50%': {
        background: '#add8e65e',
      },
    },
    visibleEdit: {
      display: 'block',
    },
    invisibleEdit: {
      display: 'none',
    },
  }),
);

TableBody.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
  providedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  title: PropTypes.string,
  addEvent: PropTypes.func,
  deleteService: PropTypes.func,
  isEdit: PropTypes.bool,
  onEditService: PropTypes.func,
  serviceId: PropTypes.number,
};

export default TableBody;
