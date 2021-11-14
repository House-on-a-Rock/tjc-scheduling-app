import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Button, Dialog } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { ValidatedTextField, ValidatedSelect } from '../FormControl';
import { useValidatedField } from '../../hooks';
import Table from '../Schedule/Table';
import SchedulePreview from '../Template/SchedulePreview';

import { buttonTheme, tooltipContainer } from '../../shared/styles/theme';

import Tooltip from './Tooltip';
import {
  stringLengthCheck,
  zeroPaddedDateString,
  incrementDate,
  weeksRange,
  createColumns,
} from '../../shared/utilities';

// TODO hook up teams with data from DB

export const NewScheduleForm = ({
  onClose,
  error,
  onSubmit,
  templateId,
  templates,
  teams,
  isOpen,
}) => {
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
  const classes = useStyles();

  const [title, setTitle, setTitleError, resetTitleError] = useValidatedField(
    '',
    'Must have a title that is less than 32 characters',
  );
  const [startDate, setStartDate, setStartError, resetStartError] = useValidatedField(
    zeroPaddedDateString(new Date()),
    'Invalid date range',
  );
  const [endDate, setEndDate, setEndError, resetEndError] = useValidatedField(
    zeroPaddedDateString(new Date(tomorrow)),
    'Invalid date range',
  );
  const [team, setTeam, setTeamError, resetTeamError] = useValidatedField(
    0,
    'Please assign a team to this schedule',
  );
  const [template, setTemplate, setTemplateError, resetTemplateError] = useValidatedField(
    templateId ?? 0,
    '',
  );
  const [previewProps, setPreviewProps] = useState(defaultTableProps());

  useEffect(() => {
    setPreviewProps((p) => updatePreviewProps(p));
  }, [startDate, endDate, template]);

  const Preview = () =>
    previewProps.dataModel ? (
      <div className={classes.preview}>
        Schedule Preview
        <SchedulePreview {...previewProps} />
      </div>
    ) : null;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg">
      <div className={classes.newScheduleForm}>
        <h2>Create a New Schedule</h2>
        <div className={classes.contentContainer}>
          <form className={classes.formStyle}>
            {error && (
              <div style={{ color: 'red' }}>{`${error?.response.data.message}`}</div>
            )}
            <div className={classes.tooltipContainer}>
              <ValidatedTextField
                className={classes.nameInput}
                label="Schedule Title"
                input={title}
                handleChange={setTitle}
                autoFocus
              />
              <Tooltip
                id="scheduleName"
                text="Example name: Jan-Mar Schedule. Must be unique"
              />
            </div>
            <div className={classes.tooltipContainer}>
              <ValidatedTextField
                className={classes.datePicker}
                label="Start Date"
                input={startDate}
                handleChange={setStartDateHandler}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <ValidatedTextField
                className={classes.datePicker}
                label="End Date"
                input={endDate}
                handleChange={setEndDate}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Tooltip
                id="datePicker"
                text="Select the begin date and end date for this schedule"
              />
            </div>
            <div className={classes.tooltipContainer}>
              <ValidatedSelect
                className={classes.selectContainer}
                input={team}
                label="Team"
                onChange={setTeam}
                toolTip={{ id: 'team', text: 'Assign a team to this schedule' }}
              >
                <MenuItem value={0}>Assign this schedule to a team</MenuItem>
                <MenuItem value={1}>Church Council</MenuItem>
                <MenuItem value={2}>RE</MenuItem>
              </ValidatedSelect>
            </div>
            <div className={classes.tooltipContainer}>
              <ValidatedSelect
                className={classes.selectContainer}
                input={template}
                onChange={setTemplate}
                label="Template"
                toolTip={{ id: 'template', text: 'Assign a template to this schedule' }}
              >
                <MenuItem value={0}>Pick a template</MenuItem>
                {templates.map(({ templateId: id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </ValidatedSelect>
            </div>
          </form>
          <Preview />
        </div>
        <div className={classes.buttonBottomBar}>
          <Button
            onClick={onSubmitForm}
            variant="contained"
            className={classes.submitButton}
          >
            Create a new schedule!
          </Button>
          <Button onClick={onClose} className={classes.button}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );

  function updatePreviewProps(prevTemplate) {
    const selectedTemplate =
      template.value > 0 ? templates.find((t) => t.templateId === template.value) : 0;
    const populatedTemplate = populateTemplateCells(selectedTemplate);
    return {
      ...prevTemplate,
      schedule: { columns: tableHeaders(), title: selectedTemplate.name ?? '' },
      dataModel: populatedTemplate ? populatedTemplate.data : null,
    };
  }

  function populateTemplateCells(selectedTemplate) {
    if (!selectedTemplate.data) return selectedTemplate.data;
    const data = selectedTemplate.data.map((service) => {
      const updatedEvents = service.events.map((event) => {
        return {
          ...event,
          cells: new Array(previewProps.schedule.columns.length - 1).fill({}),
        };
      });
      return { ...service, events: updatedEvents };
    });
    return { ...selectedTemplate, data };
  }

  function setStartDateHandler(input) {
    setStartDate(input);
    const incrementedDate = incrementDate(input.value);
    setEndDate({
      value: zeroPaddedDateString(incrementedDate),
      message: '',
      valid: true,
    });
  }

  function tableHeaders() {
    const weekRange = weeksRange(startDate.value, endDate.value);
    const columns = createColumns(weekRange);
    return columns;
  }

  function defaultTableProps() {
    return {
      schedule: { columns: tableHeaders(), title: '' },
      // isEditMode: false,
      // isVisible: true,
      dataModel: [],
      // setDataModel: () => {},
      // users: [],
      teams,
      // churchId: 0,
      // incrementChangesCounter: () => {},
    };
  }

  // TODO pass in teams
  function onSubmitForm() {
    resetTitleError();
    resetStartError();
    resetEndError();
    resetTeamError();
    resetTemplateError();

    if (
      title.value.length > 0 &&
      title.value.length < 32 &&
      endDate.value > startDate.value &&
      team.value > 0
      // template can be zero
    )
      onSubmit({
        title: title.value,
        startDate: startDate.value,
        endDate: endDate.value,
        view: 'weekly',
        team: team.value,
        templateId: template.value,
      });

    setTitleError(stringLengthCheck(title.value));
    setStartError(endDate.value < startDate.value);
    setEndError(endDate.value < startDate.value);
    setTeamError(team.value === 0);
    // setTemplateError(template.value === 0);
  }
};

const useStyles = makeStyles({
  newScheduleForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    // width: 2000,
    margin: 'auto',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 20,
    zIndex: 10,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 'max-content',
    height: 'max-content',
  },
  preview: {
    // display: 'flex',
    // flexDirection: 'column',
    width: 1000,
    height: 1000,
    margin: 'auto',
    justifyContent: 'center',
    padding: 20,
  },
  formStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePicker: {
    marginTop: 0,
  },
  tooltipContainer: {
    '&': {
      ...tooltipContainer,
    },
  },
  nameInput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 0,
  },
  selectContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  selectInput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  submitButton: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    margin: '5px',
    ...buttonTheme.filled,
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    margin: '5px',
    '&:hover, &:focus': {
      ...buttonTheme.filled.hover,
    },
  },
  buttonBottomBar: {
    minHeight: 'unset',
    flexWrap: 'wrap',
    alignSelf: 'end',
  },
});

NewScheduleForm.propTypes = {
  onClose: PropTypes.func,
  error: PropTypes.object,
  onSubmit: PropTypes.func,
  templateId: PropTypes.number,
  templates: PropTypes.array,
  teams: PropTypes.array,
  isOpen: PropTypes.bool,
};

export default NewScheduleForm;
