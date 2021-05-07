import React from 'react';
import PropTypes from 'prop-types';
import { renderOption } from './utilities';
import { TimeCell, DutyAutocomplete, TasksAutocomplete } from '.';
import MuiCell from '@material-ui/core/TableCell';

const TableCell = ({
  cellIndices,
  roleId,
  userId = 0,
  taskId = 0,
  time,
  teams,
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
    <MuiCell></MuiCell>
  ) : (
    <TasksAutocomplete
      dataId={userId}
      roleId={roleId}
      options={tasksDataSet}
      dataContext={taskDataContext}
      onChange={onTaskChange}
      renderOption={renderOption}
      isEditMode={isEditMode}
      isScheduleModified={isScheduleModified}
    />
  );
};

TableCell.propTypes = {
  cellIndices: PropTypes.object,
  roleId: PropTypes.number,
  userId: PropTypes.number,
  taskId: PropTypes.number,
  time: PropTypes.string,
  teams: PropTypes.array,
  onTimeChange: PropTypes.func,
  onAssignedRoleChange: PropTypes.func,
  onTaskChange: PropTypes.func,
  isTimeDisplayed: PropTypes.bool,
  tasksDataSet: PropTypes.array,
  isScheduleModified: PropTypes.bool,
  isEditMode: PropTypes.bool,
};
export default TableCell;
