import React from 'react';
import PropTypes from 'prop-types';

// mat ui
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { TemplateDisplay } from '../../components/Template/TemplateDisplay';
import { buttonTheme } from '../../shared/styles/theme';

const TemplateContainer = ({ state }) => {
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

const useStyles = makeStyles((theme) =>
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

TemplateContainer.propTypes = {
  state: PropTypes.object,
};

export default TemplateContainer;
