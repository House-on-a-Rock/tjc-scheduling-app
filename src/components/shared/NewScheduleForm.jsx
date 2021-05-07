import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Button, Dialog } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { ValidatedTextField, ValidatedSelect } from '../FormControl';
import { useValidatedField } from '../../hooks';

import { buttonTheme, tooltipContainer } from '../../shared/styles/theme';

import Tooltip from './Tooltip';
import { stringLengthCheck } from '../../shared/utilities';

// TODO hook up teams with data from DB

export const NewScheduleForm = ({
  onClose,
  error,
  onSubmit,
  templateId,
  templates,
  isOpen,
}) => {
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
  const classes = useStyles();

  const [title, setTitle, setTitleError, resetTitleError] = useValidatedField(
    '',
    'Must have a title that is less than 32 characters',
  );
  const [startDate, setStartDate, setStartError, resetStartError] = useValidatedField(
    toDateString(new Date()),
    'Invalid date range',
  );
  const [endDate, setEndDate, setEndError, resetEndError] = useValidatedField(
    toDateString(new Date(tomorrow)),
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

  // TODO pass in roles/teams

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

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className={classes.newScheduleForm}>
        <h2>Create a New Schedule</h2>
        <form className={classes.formStyle}>
          {error && (
            <div style={{ color: 'red' }}>
              {`Status code ${error?.response.status}: ${error?.response.statusText}`}
            </div>
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
              handleChange={setStartDate}
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
              {templates
                ? templates.map(({ templateId: id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))
                : [
                    <MenuItem value={1} key="1">
                      Weekly Services
                    </MenuItem>,
                    <MenuItem value={2} key="2">
                      RE
                    </MenuItem>,
                  ]}
            </ValidatedSelect>
          </div>
        </form>
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
};

// needed to format date so that the date picker can display it properly
function toDateString(date) {
  // need to pad months/dates with 0s if single digit
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;
  return `${date.getFullYear()}-${month}-${day}`;
}

const useStyles = makeStyles(() =>
  createStyles({
    newScheduleForm: {
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
  }),
);

NewScheduleForm.propTypes = {
  onClose: PropTypes.func,
  error: PropTypes.object,
  onSubmit: PropTypes.func,
  templateId: PropTypes.number,
  templates: PropTypes.array,
  isOpen: PropTypes.bool,
};

export default NewScheduleForm;
