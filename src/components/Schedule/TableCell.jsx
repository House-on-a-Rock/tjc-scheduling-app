import React from 'react';
import PropTypes from 'prop-types';
import { renderOption, cellStatus } from './utilities';
import { TimeCell, DutyAutocomplete, TasksAutocomplete, PlaceHolderCell } from '.';

const TableCell = ({
  cellIndices,
  roleId,
  userId = 0,
  taskId = 0,
  status = cellStatus.SYNCED,
  time,
  teams,
  users,
  onTimeChange,
  onAssignedRoleChange,
  onTaskChange,
  isTimeDisplayed,
  tasksDataSet,
  isScheduleModified,
  isEditMode,
}) => {
  const { serviceIndex, rowIndex, columnIndex } = cellIndices;
  const roleDataContext = {
    serviceIndex,
    rowIndex,
    roleId,
  };
  const taskDataContext = {
    taskId: taskId,
    roleId: roleId,
    serviceIndex,
    rowIndex,
    columnIndex,
  };

  const augmentedDataSet = React.useMemo(
    () => augmentDataSet(tasksDataSet, userId, users),
    [userId, tasksDataSet],
  );

  return cellIndices.columnIndex === 0 ? (
    <TimeCell
      time={time}
      isDisplayed={isTimeDisplayed}
      onChange={onTimeChange}
      rowIndex={cellIndices.rowIndex}
      serviceIndex={cellIndices.serviceIndex}
      isEditMode={isEditMode}
      isScheduleModified={isScheduleModified}
    />
  ) : cellIndices.columnIndex === 1 ? (
    <DutyAutocomplete
      dataId={roleId}
      options={teams}
      dataContext={roleDataContext}
      onChange={onAssignedRoleChange}
      renderOption={renderOption}
      isEditMode={isEditMode}
      isScheduleModified={isScheduleModified}
    />
  ) : userId === null && taskId === null ? (
    <PlaceHolderCell />
  ) : (
    <TasksAutocomplete
      dataId={userId}
      options={augmentedDataSet}
      status={status}
      dataContext={taskDataContext}
      onChange={onTaskChange}
      renderOption={renderOption}
      isEditMode={isEditMode}
    />
  );
};

function augmentDataSet(dataSet, userId, users) {
  const isDataIdPresent = dataSet.some((user) => user.userId === userId);

  if (!isDataIdPresent && userId) {
    const index = users.findIndex((user) => user.userId === userId);
    dataSet.push(users[index]);
  }
  return dataSet;
}

TableCell.propTypes = {
  cellIndices: PropTypes.object,
  roleId: PropTypes.number,
  userId: PropTypes.number,
  taskId: PropTypes.number,
  status: PropTypes.string,
  time: PropTypes.string,
  teams: PropTypes.array,
  users: PropTypes.array,
  onTimeChange: PropTypes.func,
  onAssignedRoleChange: PropTypes.func,
  onTaskChange: PropTypes.func,
  isTimeDisplayed: PropTypes.bool,
  tasksDataSet: PropTypes.array,
  isScheduleModified: PropTypes.bool,
  isEditMode: PropTypes.bool,
};
export default TableCell;
