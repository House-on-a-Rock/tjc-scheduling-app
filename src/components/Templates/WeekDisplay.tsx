import React from 'react';
import { days } from '../../shared/utilities/dates';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const WeekDisplay = ({ templateData }) => {
  console.log('templateData', templateData);
  const classes = useStyles();

  function populateDay(day) {
    return templateData.filter((service) => service.day === day);
  }

  // TODO align the services by time of day~ish?
  return (
    <div className={classes.weekContainer}>
      {days.map((day, index) => (
        <div className={classes.dayContainer} key={day}>
          {day}
          {populateDay(day).map((service) => (
            <div className={classes.dataContainer} key={`${service.name}_day`}>
              <p>{service.name}</p>
              {service.events.map((event) => (
                <p
                  style={{ paddingLeft: 10, margin: 0 }}
                  key={`${event.time}_${event.title}`}
                >
                  {event.time} {event.title}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    weekContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
    },
    dayContainer: {
      // width: '14%',
      border: '2px solid #f3f3f3',
    },
    dataContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);
