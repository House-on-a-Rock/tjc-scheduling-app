import React from 'react';
import PropTypes from 'prop-types';

import Table from '../Schedule/Table';
import NewScheduleForm from '../shared/NewScheduleForm';
import { useValidatedField } from '../../hooks';

const SchedulePreview = () => {
  const defaultTableProps = {
    schedule: {},
    isEditMode: true,
    isVisible: true,
    dataModel: [],
    setDataModel: () => {},
    users: [],
    teams: [],
    churchId: 0,
    incrementChangesCounter: () => {},
  };

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

  return (
    <div>
      <NewScheduleForm />
    </div>
  );
};

SchedulePreview.propTypes = {
  // churchId: PropTypes.number,
};

export default SchedulePreview;
