import React from 'react';
import { useSelector } from '../../../shared/utilities';

// queries
import { useQuery, useMutation, useQueryCache } from 'react-query';

// mat ui
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

// api
import { getTemplateData } from '../../../query';
/*
  1. Retrieve and display saved template data from db
    a. create db table 
    b. structure of template object - (id, churchId, template name, template data)
      i. template data - array of { services: { [ name: serviceName, events: { eventId, time } ] } }  should this be stringified?
      ii. are these services associated with anything? pbly not
      iii. schedules are associated with a specific template so changes to template will reflect in the schedule
      iv. when a schedule is created with a template, it will create services with that name, and add events to that schedule according to template
    
  2. Creation of new template data
    a. create new template
      i. add service
  3. Editing of template data
*/

export const Templates = () => {
  const { churchId, name: churchName } = useSelector((state) => state.profile);
  console.log('churchId', churchId);
  const { isLoading, error, data } = useQuery(['templates', churchId], getTemplateData, {
    enabled: churchId,
    refetchOnWindowFocus: false,
    staleTime: 100000000000000,
  });

  if (isLoading) return <div>Loading</div>;
  console.log('data', data);

  return <div>hi</div>;
};
