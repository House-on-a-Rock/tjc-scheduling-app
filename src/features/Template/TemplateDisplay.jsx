import PropTypes from 'prop-types';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { convert12Hrs, days } from '../Schedule/utilities';

const TemplateDisplay = ({ template }) => {
  const classes = useStyles();
  return (
    <MaUTable>
      <TableHead>
        <TableRow key="head">
          <TableCell key="time">Time</TableCell>
          <TableCell key="duty">Duty</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {template.map((service, index) => (
          <React.Fragment key={`${service.name}-${index}`}>
            <TableRow key={`${service.name}_name`}>
              <TableCell className={classes.tableCell} key={`${service.name}_name_cell`}>
                <h4 style={{ margin: 1 }}>
                  {days[service.day]} {service.name}
                </h4>
              </TableCell>
            </TableRow>
            {service.events.map((event, eventIndex) => (
              <TableRow key={`${event}_${eventIndex}`}>
                <TableCell
                  key={`${event}_time_${eventIndex}`}
                  className={classes.tableCell}
                  style={{ width: '50%' }}
                >
                  {convert12Hrs(event.time)}
                </TableCell>
                <TableCell
                  key={`${event}_title_${eventIndex}`}
                  className={classes.tableCell}
                >
                  {event.title}
                </TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </MaUTable>
  );
};
const useStyles = makeStyles((theme) =>
  createStyles({
    tableCell: {
      fontSize: 12,
      margin: 0,
      padding: 4,
    },
  }),
);

TemplateDisplay.propTypes = {
  template: PropTypes.array,
};

export default TemplateDisplay;
