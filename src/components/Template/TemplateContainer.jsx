import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useTemplateContainer from '../../hooks/containerHooks/useTemplateContainer';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import NewScheduleForm from '../shared/NewScheduleForm';

// components
import TemplateDisplay from './TemplateDisplay';
import TemplateCard from './TemplateCard';

export const TemplateContainer = ({ churchId }) => {
  const classes = useStyles();
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [isLoading, templates, createSchedule, deleteTemplate] = useTemplateContainer(
    churchId,
    setIsNewScheduleOpen,
  );

  if (isLoading) return <div>Loading</div>;

  // TODO add confirmation alerts
  return (
    <div>
      <h2>View and manage your templates</h2>
      <p>You may create new schedules, or delete existing templates.</p>
      <p>
        To create a new template, build a schedule from the schedule screen, and save it
        as a new template
      </p>
      <div className={classes.templateContainer}>
        {templates.map((template, index) => {
          const { name, templateId, data } = template;
          return (
            <TemplateCard
              name={name}
              templateId={templateId}
              key={index.toString()}
              onAddClick={onAddClick}
              onDeleteClick={onDeleteClick}
            >
              <TemplateDisplay template={data} />
            </TemplateCard>
          );
        })}
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
    </div>
  );

  function onAddClick(templateId) {
    setSelectedTemplateId(templateId);
    setIsNewScheduleOpen(true);
  }

  function onDeleteClick(templateId) {
    // delete selected template
    // dialog to prompt if sure
    deleteTemplate.mutate({ templateId, churchId });
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    templateContainer: {
      width: '100%',
      display: 'grid',
      'grid-template-columns': '25% 25% 25% 25%',
    },
  }),
);

TemplateContainer.propTypes = {
  churchId: PropTypes.number,
};

export default TemplateContainer;
