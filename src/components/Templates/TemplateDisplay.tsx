import React from 'react';

// mat ui
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { WeekDisplay } from './WeekDisplay';

// TODO make pretty, maybe use a
export const TemplateDisplay = ({ template }: any) => {
  const classes = useStyles();

  const { data } = template;
  return (
    <div>
      <Accordion>
        <AccordionSummary className={classes.accordionSummary}>
          {template.name}
        </AccordionSummary>
        <AccordionDetails>
          <WeekDisplay templateData={data} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
// howard u can work ur magic here hehe, i think the components have some shadows out of the box but I didn't spend a lotta time here
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordionSummary: {
      backgroundColor: 'white',
      borderRadius: '5px',
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      margin: 4,
    },
  }),
);
