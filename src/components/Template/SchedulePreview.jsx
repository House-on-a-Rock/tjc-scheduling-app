import React from 'react';
import PropTypes from 'prop-types';

import Table from '../Schedule/Table';
import NewScheduleForm from '../shared/NewScheduleForm';

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
