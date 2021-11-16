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
    church: { name: '' }, // TODO pass in blank name
    churchId: churchId,
    disabled: false,
    teams: [],
  };
};

export const createBlankEvent = (serviceId, incrementChangesCounter) => {
  return {
    eventId: -incrementChangesCounter(),
    cells: [{}, {}],
    roleId: 1,
    time: '00:00',
    serviceId,
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

    for (const eventIndex in serviceScope.events) {
      const eventScope = serviceScope.events[eventIndex];
      const eventModel = serviceModel.events[eventIndex];

      if (eventScope.time)
        changes.push({ eventId: eventModel.eventId, time: eventScope.time });
      if (eventScope.roleId)
        changes.push({ eventId: eventModel.eventId, roleId: eventScope.roleId });

      for (const cellIndex in eventScope.cells) {
        const cellScope = eventScope.cells[cellIndex];
        const cellModel = eventModel.cells[cellIndex];
        changes.push({ taskId: cellModel.taskId, userId: cellScope.userId });
      }
    }
  }
  return changes;
}

// converts array to object with key as its property. This makes it easier to compare the two arrays through property instead of looping through array
function convertToObject(array, key) {
  return array.reduce(
    (acc, item, index) => ({ ...acc, [item[key]]: { ...item, order: index } }),
    {},
  );
}
function findDeleted(a1, a2) {
  // a1 is original, a2 will be the one with possible deletions
  const deleted = [];
  for (const key in a1) {
    if (!a2[key]) deleted.push(key);
  }
  return deleted;
}

function extractEvents(eventWrapper) {
  return eventWrapper.reduce((acc, item) => [...acc, ...item.events], []);
}

export function formatData(dataModel, previousServices, scheduleId) {
  // returns {
  //     deletedServices: [ deleted serviceIds ],
  //     deletedEvents: [ deleted eventIds ],
  //     dataModel: [{services: serviceId, scheduleId, name, day, events: { time, roleId, eventId, serviceId }}]
  // }
  const updated = {};

  // processing data to make it easier to find deleted
  const servicesObject = convertToObject(previousServices, 'serviceId');
  const dataModelObject = convertToObject(dataModel, 'serviceId');
  const servicesEvents = extractEvents(previousServices);
  const dataModelEvents = extractEvents(dataModel);
  const objectifiedDMEvents = convertToObject(dataModelEvents, 'eventId');
  const objectifiedOriginalEvents = convertToObject(servicesEvents, 'eventId');

  updated.deletedServices = findDeleted(servicesObject, dataModelObject);
  updated.deletedEvents = findDeleted(objectifiedOriginalEvents, objectifiedDMEvents);
  updated.dataModel = { dataModel, scheduleId };
  return updated;
}

// Styling for dropdown box for task autocompletes
export function renderOption(display, isIconVisible) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        // width: 100, would like this to expand so each name is one line, but it seems to be fixed to the width of the cell
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

export function createBlankService(scheduleId, incrementChangesCounter) {
  return {
    name: 'New Service',
    day: 0,
    events: [],
    serviceId: -incrementChangesCounter(),
    scheduleId,
  };
}

export const cellStatus = {
  SYNCED: 'synced',
  MODIFIED: 'modified',
  WARNING: 'warning',
};

export const arrayEquals = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].userId !== arr2[i].userId) return false;
  }
  return true;
};

export function convert12Hrs(time) {
  const hrs = time.slice(0, 2);
  const minutes = time.slice(3);
  if (parseInt(hrs) - 12 > 0) return `${parseInt(hrs) - 12}:${minutes} PM`;
  return `${time} AM`;
}
