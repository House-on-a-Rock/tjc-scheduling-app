import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useTemplateContainer from '../../hooks/containerHooks/useTemplateContainer';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import NewScheduleForm from '../shared/NewScheduleForm';
import CustomDialog from '../shared/CustomDialog';
import SchedulePreview from './SchedulePreview';

// components
import TemplateDisplay from './TemplateDisplay';
import TemplateCard from './TemplateCard';

export const TemplateContainer = ({ churchId, setAlert }) => {
  const classes = useStyles();

  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [dialogState, setDialogState] = useState({ isOpen: false, state: '' });
  const [loaded, templates, teams, createSchedule, deleteTemplate] = useTemplateContainer(
    churchId,
    setIsNewScheduleOpen,
    setAlert,
  );

  if (!loaded) return <div>Loading</div>;

  const DELETETEMPLATE = 'DELETETEMPLATE';

  const DialogConfig = {
    DELETETEMPLATE: {
      title: 'Delete template',
      warningText: 'Are you sure you want to delete this template? This cannot be undone',
      description: '',
      handleClose: resetDialog,
      handleSubmit: (event) => dialogSubmitWrapper(event, onSubmitDelete),
    },
  };

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
            teams={teams}
            templateId={selectedTemplateId}
            templates={templates}
          />
        )}
        {dialogState.isOpen && (
          <CustomDialog open={dialogState.isOpen} {...DialogConfig[dialogState.state]} />
        )}
      </div>
    </div>
  );

  function onAddClick(templateId) {
    setSelectedTemplateId(templateId);
    setIsNewScheduleOpen(true);
  }

  function onDeleteClick(templateId) {
    setDialogState({ isOpen: true, state: DELETETEMPLATE, templateId });
  }

  function onSubmitDelete() {
    deleteTemplate.mutate({ templateId: dialogState.templateId, churchId });
  }

  function dialogSubmitWrapper(event, callback) {
    event.preventDefault();
    callback();
    resetDialog();
  }

  function resetDialog() {
    setDialogState({ state: '', isOpen: false });
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
  setAlert: PropTypes.func,
};

export default TemplateContainer;
