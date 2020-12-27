import React from 'react';

// mat ui
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

interface TemplateFormProps {
  onClose: () => void;
  error?: boolean;
  onSubmit: () => void;
}

export const TemplateForm = ({ onClose, error, onSubmit }: TemplateFormProps) => {
  const classes = useStyles();
  console.log('template fform open');

  return (
    <div className={classes.root}>
      <h2>Template Form</h2>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: 'max-content',
      margin: 'auto',
      textAlign: 'center',
      backgroundColor: 'white',
      padding: 20,
      zIndex: 10,
    },
  }),
);
