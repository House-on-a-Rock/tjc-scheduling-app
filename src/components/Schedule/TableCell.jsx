import React from 'react';
import PropTypes from 'prop-types';
import { renderOption, cellStatus } from './utilities';
import { TimeCell, DutyAutocomplete, TasksAutocomplete, PlaceHolderCell } from '.';

const TableCell = ({
  cellIndices,
  roleId,
  userId = 0,
  taskId = 0,
  date = '',
  status = cellStatus.SYNCED,
  time,
  teams,
  users,
  onTimeChange,
  onAssignedRoleChange,
  onTaskChange,
  isTimeDisplayed,
  tasksDataSet,
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

  return cellIndices.columnIndex === 0 ? (
    <TimeCell
      time={time}
      isDisplayed={isTimeDisplayed}
      onChange={onTimeChange}
      rowIndex={cellIndices.rowIndex}
      serviceIndex={cellIndices.serviceIndex}
      isEditMode={isEditMode}
    />
  ) : cellIndices.columnIndex === 1 ? (
    <DutyAutocomplete
      dataId={roleId}
      options={teams}
      dataContext={roleDataContext}
      onChange={onAssignedRoleChange}
      renderOption={renderOption}
      isEditMode={isEditMode}
    />
  ) : userId === null && taskId === null ? (
    <PlaceHolderCell />
  ) : (
    <TasksAutocomplete
      taskId={taskId}
      dataId={userId}
      options={augmentDataSet(tasksDataSet, userId, users)}
      status={status}
      dataContext={taskDataContext}
      onChange={onTaskChange}
      renderOption={renderOption}
      isEditMode={isEditMode}
      date={date}
    />
  );
};

// if userId does not appear in dataSet, add that user to be displayed in options
function augmentDataSet(dataSet, userId, users) {
  const isDataIdPresent = dataSet.some((user) => user.userId === userId);

  if (!isDataIdPresent && userId) {
    const clone = [...dataSet];
    const index = users.findIndex((user) => user.userId === userId);
    clone.push(users[index]);
    return clone;
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
  isEditMode: PropTypes.bool,
  date: PropTypes.string,
};
export default TableCell;
