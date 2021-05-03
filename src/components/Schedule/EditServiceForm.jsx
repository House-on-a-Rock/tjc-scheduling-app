import React from 'react';
import PropTypes from 'prop-types';

import { MenuItem, Button, Dialog } from '@material-ui/core/';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { ValidatedSelect, ValidatedTextField } from '../FormControl';
import { useValidatedField } from '../../hooks';
import DragDropList from '../shared/DragDropList';

import { buttonTheme, tooltipContainer } from '../../shared/styles/theme';
import { stringLengthCheck } from '../../shared/utilities';

/*
  Allows editing of name, associated day, and order
  Changes are made to datamodel, and saved when all stop edit button is clicked
  Error checking for duplicate service names on the same day
*/

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const EditServiceForm = ({ isOpen, onSubmit, onClose, serviceId, dataModel }) => {
  const [dataClone, setDataClone] = React.useState([...dataModel]);
  const serviceIndex = dataClone.findIndex((service) => service.serviceId === serviceId);
  const { name, day } = dataClone[serviceIndex];
  const [
    serviceName,
    setServiceName,
    setServiceNameError,
    resetServiceNameError,
  ] = useValidatedField(name, 'Must have a name that is less than 32 characters');
  const [dayOfWeek, setDayOfWeek, setDayWeekError, resetDayWeekError] = useValidatedField(
    day,
    'Must select a day of the week',
  );

  const classes = useStyles();

  // console.log(`dataModel, serviceIndex`, dataModel, serviceIndex);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className={classes.EditServiceForm}>
        <h2>Edit Service</h2>
        {/* {error && (
          <div style={{ color: 'red' }}>
            {`Status code ${error.response.status}: ${error.response.statusText}`}
          </div>
        )} */}
        <form>
          <ValidatedTextField
            name="Service Name"
            label="Service Name"
            input={serviceName}
            handleChange={onNameChange}
            autoFocus
          />
          <div className={classes.tooltipContainer}>
            <ValidatedSelect
              input={dayOfWeek}
              onChange={onDayChange}
              toolTip={{
                id: 'Day of Week',
                text: 'Select the day of the week this schedule is for',
              }}
              label="Day of Week"
              className={classes.selectContainer}
            >
              <MenuItem value={-1}>
                Select which day of the week this schedule is for
              </MenuItem>
              {daysOfWeek.map((d, index) => (
                <MenuItem key={index.toString()} value={index}>
                  {d}
                </MenuItem>
              ))}
            </ValidatedSelect>
          </div>
          <h3>Change the order of the services</h3>
          <DragDropList listItems={dataClone} onEnd={onDragEnd} serviceId={serviceId} />
        </form>

        <div className={classes.buttonBottomBar}>
          <Button onClick={onSubmitForm} className={classes.submitButton}>
            Save Changes
          </Button>
          <Button onClick={onClose} className={classes.button}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );

  function onNameChange(input) {
    const temp = dataClone;
    temp[serviceIndex].name = input.value;
    setDataClone(temp);
    setServiceName(input);
  }

  function onDayChange(input) {
    const temp = dataClone;
    temp[serviceIndex].day = input.value;
    setDataClone(temp);
    setDayOfWeek(input);
  }

  function onSubmitForm() {
    resetServiceNameError();
    resetDayWeekError();

    if (
      serviceName.value.length > 0 &&
      serviceName.value.length < 32 &&
      dayOfWeek.value >= 0
    )
      onSubmit(dataClone);
    setServiceNameError(stringLengthCheck(serviceName.value));
    setDayWeekError(dayOfWeek.value < 0);
  }

  function onDragEnd(result) {
    const {
      destination: { index: destination },
      source: { index: source },
    } = result;
    if (!destination || destination === source) {
      return;
    }
    setDataClone((prev) => {
      const temp = [...prev];
      const src = temp.splice(source, 1);
      temp.splice(destination, 0, src[0]);
      return temp;
    });
  }
};

const useStyles = makeStyles(() =>
  createStyles({
    EditServiceForm: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'max-content',
      margin: 'auto',
      textAlign: 'center',
      padding: 20,
    },
    selectContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      minWidth: 400,
    },
    tooltipContainer: {
      '&': {
        ...tooltipContainer,
      },
    },
    buttonBottomBar: {
      minHeight: 'unset',
      flexWrap: 'wrap',
      alignSelf: 'end',
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
  }),
);

EditServiceForm.propTypes = {
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  serviceId: PropTypes.number,
  dataModel: PropTypes.array,
};

export default EditServiceForm;
