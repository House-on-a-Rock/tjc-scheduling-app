import { DayIndexOptions } from '../../shared/types';
import { UsersDataInterface, BootstrapData } from './ScheduleContainer';

const idxToMonth = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
export const days: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const dayIndex: DayIndexOptions = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const readableDate = (unreadableDate: Date) =>
  `${
    unreadableDate.getMonth() + 1
  }/${unreadableDate.getDate()}/${unreadableDate.getFullYear()}`;

const incrementDay = (date: Date) => new Date(date.setDate(date.getDate() + 1));

// these look unused, i think this functionality was moved to server since I had to modify a function there
function determineStartDate(startDate: string, day: number) {
  let current = incrementDay(new Date(startDate));
  while (current.getDay() !== day) current = incrementDay(current);
  return current;
}

export function everyRepeatingDayBetweenTwoDates(
  startDate: string,
  endDate: string,
  day: string,
) {
  const everyRepeatingDay = [];
  let start = new Date(startDate);

  if (start.getDay() !== dayIndex[day])
    start = determineStartDate(startDate, dayIndex[day]);

  let current = new Date(start);
  const end = new Date(endDate);

  while (current <= end) {
    everyRepeatingDay.push(readableDate(current));
    current = new Date(current.setDate(current.getDate() + 7));
  }
  return everyRepeatingDay;
}

const zeroPaddingDates = (monthIdx: number, dayIdx: number): string => {
  let month = (monthIdx + 1).toString();
  let day = dayIdx.toString();

  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;

  return `${month}/${day}`;
};

export function columnizedDates(everyRepeatingDay: string[]) {
  return everyRepeatingDay.map((date: string) => {
    const jsDate = new Date(date);
    const monthIdx = jsDate.getMonth();
    const dayIdx = jsDate.getDate();
    return {
      Header: zeroPaddingDates(monthIdx, dayIdx),
      accessor: zeroPaddingDates(monthIdx, dayIdx),
    };
  });
}

export function isInTime(target: string, start: string, end: string): boolean {
  const targetTime = timeToMilliSeconds(target);
  const startTime = timeToMilliSeconds(start);
  const endTime = timeToMilliSeconds(end);
  return startTime <= targetTime && targetTime <= endTime;
}

export function timeToMilliSeconds(time: string) {
  const [hourMin, period] = time.split(' ');
  const [hour, min] = hourMin.split(':');
  const convertedHour = hour === '12' ? 3600000 : 3600000 * parseInt(hour, 10);
  const convertedMin = 60000 * parseInt(min, 10);
  const convertedPeriod = period === 'AM' ? 0 : 43200000;

  return convertedHour + convertedMin + convertedPeriod;
}

export const contrivedDate = (date: string) => {
  const jsDate = new Date(date);
  const monthIdx = jsDate.getMonth();
  const dayIdx = jsDate.getDate();
  return zeroPaddingDates(monthIdx, dayIdx);
};

// autocomplete cell functions
export function extractRoleIds(teams): number[] {
  return teams.map((team) => team.id);
}

export function getRoleOptionLabel(option, dataSet) {
  const filteredData = dataSet.filter((role) => role.id === option)[0];
  if (filteredData) return `${filteredData.name}`;
  return '';
}

export function getUserOptionLabel(option: number, dataSet) {
  const filteredData = dataSet.filter((user) => user.userId === option)[0];
  if (filteredData) return `${filteredData.firstName} ${filteredData.lastName}`;
  else return '';
}

export function extractTeammateIds(teammates): number[] {
  if (!teammates) return [];
  return teammates.map((teammate) => teammate.userId);
}

export const teammates = (users, roleId: number, churchId) => {
  const filteredTeammates = users.filter((user) =>
    user.teams.some((team) => team.id === roleId),
  );
  filteredTeammates.push(blankTeammate(churchId)); // adds blankteammate to list incase they wish to leave it blank
  return filteredTeammates;
};

export const blankTeammate = (churchId: number): UsersDataInterface => {
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

const createBlankEventCells = (cellLength: number, seedFx) => {
  const taskCells: any = [{}, {}]; // data from these cells aren't actually being used, are just placeholders for rendering
  const afterTimeAndDutyColumns = 2;
  for (let i = afterTimeAndDutyColumns; i < cellLength; i++) {
    taskCells[i] = createBlankTask(seedFx);
  }
  return taskCells;
};

export const createBlankEvent = (cellLength: number, seedFx) => {
  return {
    cells: [...createBlankEventCells(cellLength, seedFx)],
    eventId: seedFx(),
    roleId: -1, // placeholder, since it's unknown at time of creation. TODO onsubmit, check that these are assigned and not negative
    time: '',
  };
};

export function roleDisplay(roleId: number, dataModel: BootstrapData): string {
  if (roleId < 0) return '';
  return dataModel.teams.filter((team) => team.id === roleId)[0].name;
}

export function retrieveDroppableServiceId(result) {
  return parseInt(result.source.droppableId[result.source.droppableId.length - 1]);
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function processUpdate(diff, dm, tab) {
  if (isObjectEmpty(diff.updated)) return;
  const scheduleScope = diff.updated[tab];
  const changes = [];

  for (let serviceIndex in scheduleScope.services) {
    const serviceScope = scheduleScope.services[serviceIndex];
    const serviceModel = dm[tab].services[serviceIndex];

    // (eventually) changeable items: day, name
    for (let eventIndex in serviceScope.events) {
      // items: roleId, time
      const eventScope = serviceScope.events[eventIndex];
      const eventModel = serviceModel.events[eventIndex];

      if (eventScope.time)
        changes.push({ eventId: eventModel.eventId, time: eventScope.time });
      if (eventScope.roleId)
        changes.push({ eventId: eventModel.eventId, roleId: eventScope.roleId });

      for (let cellIndex in eventScope.cells) {
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
  if (isObjectEmpty(diff.added)) return;
  const scheduleScope = diff.added[tab];
  const changes = [];

  for (let serviceIndex in scheduleScope.services) {
    const serviceScope = scheduleScope.services[serviceIndex];

    for (let eventIndex in serviceScope.events) {
      const eventScope = serviceScope.events[eventIndex];

      const cells = [];
      for (let cellIndex in eventScope.cells) {
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

export function processRemoved(diff, tab) {
  if (isObjectEmpty(diff.removed)) return;
  const scheduleScope = diff.removed[tab];
  const changes = [];
  console.log(`scheduleScope`, scheduleScope);

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
