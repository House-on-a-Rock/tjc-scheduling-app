import React from 'react';
// import { useSelector } from '../../shared/utilities';

// queries
import { useQuery, useMutation } from 'react-query';

// mat ui
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
// api
import { getTemplateData } from '../../query';
import { TemplateDisplay } from './TemplateDisplay';
/*
  1. Retrieve and display saved template data from db
    a. create db table -d
    b. structure of template object - (id, churchId, template name, template data)
      i. template data - array of { services: { [ name: serviceName, events: { eventId, time } ] } }  stringified?
      ii. are these services associated with anything? pbly not
      iii. schedules are associated with a specific template so changes to template will reflect in the schedule
      iv. when a schedule is created with a template, it will create services with that name, and add events to that schedule according to template
    
    data: {
      name: Weekly Services,      
      services: [
        {
          name: Friday Evening Service,
          day: Friday,
          events: [
            {
              role: Usher,
              time: '7:00 PM'
            },
            {
              role: Hymn Leading,
              time: '7:45 PM'
            },
            {
              role: Piano,
              time: '7:45 PM'
            },
            {
              role: Sermon Speaker,
              time: '8:00 PM'
            },
            {
              role: Interpreter,
              time: '8:00 PM'
            },
            
          ]
        }
      ]
    }

  2. Creation of new template data
    a. create new template
      i. add services - new service form? or different input method
      ii. add events to services 
  3. Editing of template data
    a. inside accordion display, have edit button
*/

export const Templates = ({ churchId }: any) => {
  const classes = useStyles();

  // const { churchId, name: churchName } = useSelector((state) => state.profile);
  const { isLoading, error, data: templateData } = useQuery(
    ['templates', churchId],
    () => getTemplateData(churchId),
    {
      enabled: churchId,
      refetchOnWindowFocus: false,
      staleTime: 100000000000000,
    },
  );

  if (isLoading) return <div>Loading</div>;
  // console.log('data', templateData);

  return (
    <div>
      <p>Create, Manage, and Update Schedule Templates</p>
      <br />
      <div>
        {templateData.map((template, index) => (
          <Accordion>
            <AccordionSummary>{template.name}</AccordionSummary>
            <AccordionDetails>details here</AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleContainer: {
      margin: '5px 0 2px',
      height: '2rem',
      width: '200vw',
      position: 'sticky',
      left: '8px',
    },
  }),
);
