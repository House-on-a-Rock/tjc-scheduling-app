import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useTemplateContainer from '../../hooks/containerHooks/useTemplateContainer';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { buttonTheme } from '../../shared/styles/theme';
import NewScheduleForm from '../shared/NewScheduleForm';

// components
import TemplateDisplay from './TemplateDisplay';

export const TemplateContainer = ({ churchId }) => {
  const classes = useStyles();
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [isLoading, templates, createSchedule] = useTemplateContainer(
    churchId,
    setIsNewScheduleOpen,
  );

  if (isLoading) return <div>Loading</div>;

  // TODO add confirmation alerts
  return (
    <div className={classes.templateContainer}>
      {templates.map((template, index) => (
        <TemplateDisplay
          template={template}
          key={index.toString()}
          onAddClick={onAddClick}
        />
      ))}
      {isNewScheduleOpen && (
        <NewScheduleForm
          onClose={() => setIsNewScheduleOpen(false)}
          isOpen={isNewScheduleOpen}
          onSubmit={(newScheduleData) =>
            createSchedule.mutate({ ...newScheduleData, churchId: churchId })
          }
          error={createSchedule.error}
          templateId={selectedTemplateId}
        />
      )}
    </div>
  );

  function onAddClick(templateId) {
    setSelectedTemplateId(templateId);
    setIsNewScheduleOpen(true);
  }
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
  churchId: PropTypes.number,
};

export default TemplateContainer;
