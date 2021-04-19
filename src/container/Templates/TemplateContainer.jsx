import React, { useState } from 'react';

// mat ui
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { DataStateProp } from '../types';
import { TemplateDisplay } from '../../components/Template/TemplateDisplay';
import { buttonTheme } from '../../shared/styles/theme';

interface EventDataInterface {
  roleId: number;
  time: string;
  title: string;
}

interface ServiceDataInterface {
  name: string;
  day: string;
  events: EventDataInterface[];
}
export interface TemplateDataInterface {
  templateId: number;
  name: string;
  data: ServiceDataInterface[];
}

interface BootStrapDataInterface {
  templates: TemplateDataInterface[];
}
interface TemplateContainerProps {
  state: DataStateProp<BootStrapDataInterface>;
}

export const TemplateContainer = ({ state }: TemplateContainerProps) => {
  const classes = useStyles();
  const { isLoading, error, data, isSuccess } = state;

  return (
    <>
      <h1>Templates</h1>
      <br />
      {data?.templates && !isLoading && (
        <div className={classes.templateContainer}>
          {data?.templates.map((template, index) => (
            <TemplateDisplay template={template} key={`${index}_TemplateDisplay`} />
          ))}
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    templateContainer: {
      width: '100%',
      display: 'grid',
      'grid-template-columns': '25% 25% 25% 25%',
    },
    button: {
      position: 'sticky',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      '&:hover, &:focus': {
        ...buttonTheme.filled.hover,
      },
      display: 'flex',
      '& *': {
        margin: 'auto',
      },
    },
  }),
);
