import React, { useState } from 'react';

// queries
import { useQuery, useMutation, useQueryCache } from 'react-query';

// mat ui
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Dialog, Button } from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';

// api
import { getTemplateData } from '../../query';
import { TemplateDisplay } from './TemplateDisplay';

// utilities
import { buttonTheme } from '../../shared/styles/theme.js';

// components
import { TemplateForm } from './TemplateForm';
/*
  1. Retrieve and display saved template data from db
    a. create db table 
    b. structure of template object - ( id, churchId, name, data)
      i. template data - array of { services: { [ name: serviceName, events: { roleId, time, title } ] } }  JSON.stringified, storage type: JSON
      ii. are these services associated with anything? pbly not
      iii. schedules are associated with a specific template so changes to template will reflect in the schedule
      iv. when a schedule is created with a template, it will create services with that name, and add events to that schedule according to template    

  2. Creation of new template data
    a. create new template
      i. inputs: 
        1. name
        2. services - reuse new service form?
        3. add events to services -- autocomplete with pre-made roles ( roleId -->title, order, )

  3. Events
    a. display roles from DB
    b. "events" - ( roleId, day, order, time, title ) will be filled in. When
    c. edit events
    

  4. Editing of template data
    a. inside accordion display, have edit button
*/

export const Templates = ({ churchId }: any) => {
  const classes = useStyles();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // queries
  const { isLoading: isTemplatesLoading, error, data: templateData } = useQuery(
    ['templates', churchId],
    getTemplateData,
    {
      enabled: churchId,
      refetchOnWindowFocus: false,
      staleTime: 100000000000000,
    },
  );
  // mutation

  function createNewTemplate() {}

  function closeFormHandler() {
    setIsFormOpen(false);
  }

  function onTemplateFormSubmit() {
    // run mutation
  }

  if (isTemplatesLoading) return <div>Loading</div>;

  return (
    <div>
      <Dialog open={isFormOpen} onClose={() => closeFormHandler()}>
        <TemplateForm
          onClose={() => closeFormHandler()}
          // error={mutateScheduleError}
          onSubmit={onTemplateFormSubmit}
        />
      </Dialog>
      <h1>Create, Manage, and Update Schedule Templates</h1>
      <br />
      <div className={classes.templateContainer}>
        <p>Saved Templates</p>
        {templateData.map((template, index) => (
          <TemplateDisplay
            template={template}
            key={`${index}_TemplateDisplay`}
            setIsFormOpen={setIsFormOpen}
          />
        ))}
      </div>
      <h2>Create New Template</h2>
      <Button onClick={createNewTemplate} className={classes.button}>
        <AddIcon height={50} width={50} />
        <span>Add New Service</span>
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    templateContainer: {
      width: '75%',
    },
    button: {
      position: 'sticky',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      '&:hover, &:focus': {
        ...buttonTheme.filled,
      },
      display: 'flex',
      '& *': {
        margin: 'auto',
      },
    },
  }),
);
