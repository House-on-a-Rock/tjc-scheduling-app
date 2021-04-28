/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React from 'react';
import RemoveIcon from '@material-ui/icons/Remove';

export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// autocomplete cell functions
export function extractRoleIds(teams) {
  return teams.map((team) => team.id);
}

export function getRoleOptionLabel(option, dataSet) {
  const filteredData = dataSet.filter((role) => role.id === option)[0];
  if (filteredData) return `${filteredData.name}`;
  return '';
}

export function getUserOptionLabel(option, dataSet) {
  const filteredData = dataSet.filter((user) => user.userId === option)[0];
  if (filteredData) return `${filteredData.firstName} ${filteredData.lastName}`;
  else return '';
}

export function extractTeammateIds(teammates) {
  if (!teammates) return [];
  return teammates.map((teammate) => teammate.userId);
}

export const teammates = (users, roleId, churchId) => {
  const filteredTeammates = users.filter((user) =>
    user.teams.some((team) => team.id === roleId),
  );
  filteredTeammates.push(blankTeammate(churchId)); // adds blankteammate to list incase they wish to leave it blank
  return filteredTeammates;
};

export const blankTeammate = (churchId) => {
  return {
    userId: -1,
    firstName: '',
    lastName: '',
    email: '',
    church: { name: '' }, // TODO fill in blank name
    churchId: churchId,
    disabled: false,
    teams: [],
  };
};

const createBlankTask = (seedFx) => {
  return {
    taskId: seedFx(),
    userId: seedFx(),
  };
};

const createBlankEventCells = (cellLength, seedFx) => {
  const taskCells = [{}, {}]; // data from these cells aren't actually being used, are just placeholders for rendering
  const afterTimeAndDutyColumns = 2;
  for (let i = afterTimeAndDutyColumns; i < cellLength; i++) {
    taskCells[i] = createBlankTask(seedFx);
  }
  return taskCells;
};

export const createBlankEvent = (cellLength, seedFx) => {
  return {
    cells: [...createBlankEventCells(cellLength, seedFx)],
    eventId: seedFx(),
    roleId: -1, // placeholder, since it's unknown at time of creation. TODO onsubmit, check that these are assigned and not negative
    time: '',
  };
};

export function roleDisplay(roleId, dataModel) {
  if (roleId < 0) return '';
  return dataModel.teams.filter((team) => team.id === roleId)[0].name;
}

export function retrieveDroppableServiceId(result) {
  return parseInt(result.source.droppableId[result.source.droppableId.length - 1]);
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function processUpdate(diff, dataModel) {
  if (isObjectEmpty(diff)) return [];
  const scheduleScope = diff;

  const changes = [];

  for (const serviceIndex in scheduleScope) {
    const serviceScope = scheduleScope[serviceIndex];
    const serviceModel = dataModel[serviceIndex];

    // (eventually) changeable items: day, name
    for (const eventIndex in serviceScope.events) {
      // items: roleId, time
      const eventScope = serviceScope.events[eventIndex];
      const eventModel = serviceModel.events[eventIndex];

      if (eventScope.time)
        changes.push({ eventId: eventModel.eventId, time: eventScope.time });
      if (eventScope.roleId)
        changes.push({ eventId: eventModel.eventId, roleId: eventScope.roleId });

      for (const cellIndex in eventScope.cells) {
        // items: userId
        const cellScope = eventScope.cells[cellIndex];
        const cellModel = eventModel.cells[cellIndex];
        changes.push({ taskId: cellModel.taskId, userId: cellScope.userId });
      }
    }
  }
  return changes;
}

// how are cells tracking the correct dates?
export function processAdded(diff, tab) {
  if (isObjectEmpty(diff.added)) return [];
  const scheduleScope = diff.added[tab];
  const changes = [];

  for (const serviceIndex in scheduleScope.services) {
    const serviceScope = scheduleScope.services[serviceIndex];

    for (const eventIndex in serviceScope.events) {
      const eventScope = serviceScope.events[eventIndex];

      const cells = [];
      for (const cellIndex in eventScope.cells) {
        const cellScope = eventScope.cells[cellIndex];
        if (cellScope.taskId)
          cells.push({ taskId: cellScope.taskId, userId: cellScope.userId });
      }
      changes.push({
        eventId: eventScope.eventId,
        roleId: eventScope.roleId,
        time: eventScope.time,
        cells,
      });
    }
  }
  return changes;
}

// TODO
export function processRemoved(diff, tab) {
  if (isObjectEmpty(diff.removed)) return [];
  const scheduleScope = diff.removed[tab];
  const changes = [];

  // for (let serviceIndex in scheduleScope.services) {
  //   const serviceScope = scheduleScope.services[serviceIndex];

  //   for (let eventIndex in serviceScope.events) {
  //     const eventScope = serviceScope.events[eventIndex];

  //     const cells = [];
  //     for (let cellIndex in eventScope.cells) {
  //       const cellScope = eventScope.cells[cellIndex];
  //       if (cellScope.taskId)
  //         cells.push({ taskId: cellScope.taskId, userId: cellScope.userId });
  //     }
  //     changes.push({
  //       eventId: eventScope.eventId,
  //       roleId: eventScope.roleId,
  //       time: eventScope.time,
  //       cells,
  //     });
  //   }
  // }
  return changes;
}

export function renderOption(display, isIconVisible) {
  return (
    // TODO move div styling somewhere else?
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {display}
      {isIconVisible && (
        <RemoveIcon style={{ height: 10, width: 10, paddingLeft: 4 }} /> // icon to show which one the original assignee is. any ideas on a more appropriate icon?
      )}
    </div>
  );
}

export function rearrangeEvents(prevModel, sourceService, source, destination) {
  const temp = [...prevModel];
  const scope = temp[sourceService].events;
  const src = scope.splice(source, 1);
  scope.splice(destination, 0, src[0]);
  return temp;
}

export function createBlankService(retrieveChangesSeed) {
  return {
    name: 'test',
    day: 0,
    events: [],
    serviceId: retrieveChangesSeed(),
  };
}
