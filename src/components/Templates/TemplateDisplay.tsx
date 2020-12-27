import React from 'react';

// mat ui
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import EditIcon from '@material-ui/icons/Edit';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { WeekDisplay } from './WeekDisplay';

interface TemplateDisplay {
  template: any;
  setIsFormOpen: (boolean) => void;
}

// TODO make pretty
export const TemplateDisplay = ({ template, setIsFormOpen }: any) => {
  const classes = useStyles();

  const { data } = template;
  return (
    <div>
      <Accordion>
        <AccordionSummary className={classes.accordionSummary}>
          {template.name}
        </AccordionSummary>
        <AccordionDetails>
          <EditIcon height={20} width={20} onClick={() => setIsFormOpen(true)} />
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
