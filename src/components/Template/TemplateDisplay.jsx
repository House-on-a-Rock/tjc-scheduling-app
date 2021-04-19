import React from 'react';

// mat ui
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Card from '@material-ui/core/Card';
import MaUTable from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { makeStyles, createStyles } from '@material-ui/core/styles';


// TODO make pretty
export const TemplateDisplay = ({ template }) => {
  const classes = useStyles();
  const { data, name, templateId } = template;

  return (
    <Card raised className={classes.card}>
      <Tooltip title="Edit this template">
        <EditIcon />
      </Tooltip>
      <h3 style={{ margin: 5 }}>{name}</h3>
      <MaUTable>
        <TableHead>
          <TableRow>
            <TableCell key="time">Time</TableCell>
            <TableCell key="duty">Duty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((service) => (
            <>
              <TableRow key={`${service.name}_name`}>
                <TableCell className={classes.tableCell}>
                  <h4 style={{ margin: 1 }}>{service.name}</h4>
                </TableCell>
              </TableRow>
              {service.events.map((event, eventIndex) => (
                <TableRow key={`${event}_${eventIndex}`}>
                  <TableCell
                    key={`${event}_time_${eventIndex}`}
                    className={classes.tableCell}
                    style={{ width: '50%' }}
                  >
                    {event.time}
                  </TableCell>
                  <TableCell
                    key={`${event}_title_${eventIndex}`}
                    className={classes.tableCell}
                  >
                    {event.title}
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </MaUTable>
    </Card>
  );
};
// howard u can work ur magic here hehe
const useStyles = makeStyles((theme) =>
  createStyles({
    card: { width: '80%', padding: 10, margin: 5 },
    tableCell: {
      fontSize: 12,
      margin: 0,
      padding: 4,
    },
  }),
);
