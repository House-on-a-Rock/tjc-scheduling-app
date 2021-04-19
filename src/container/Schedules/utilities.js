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
export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const dayIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const readableDate = (unreadableDate) =>
  `${
    unreadableDate.getMonth() + 1
  }/${unreadableDate.getDate()}/${unreadableDate.getFullYear()}`;

const incrementDay = (date) => new Date(date.setDate(date.getDate() + 1));

// these look unused, i think this functionality was moved to server since I had to modify a function there
function determineStartDate(startDate, day) {
  let current = incrementDay(new Date(startDate));
  while (current.getDay() !== day) current = incrementDay(current);
  return current;
}

export function everyRepeatingDayBetweenTwoDates(startDate, endDate, day) {
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

const zeroPaddingDates = (monthIdx, dayIdx) => {
  let month = (monthIdx + 1).toString();
  let day = dayIdx.toString();

  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;

  return `${month}/${day}`;
};

export function columnizedDates(everyRepeatingDay) {
  return everyRepeatingDay.map((date) => {
    const jsDate = new Date(date);
    const monthIdx = jsDate.getMonth();
    const dayIdx = jsDate.getDate();
    return {
      Header: zeroPaddingDates(monthIdx, dayIdx),
      accessor: zeroPaddingDates(monthIdx, dayIdx),
    };
  });
}

export function isInTime(target, start, end) {
  const targetTime = timeToMilliSeconds(target);
  const startTime = timeToMilliSeconds(start);
  const endTime = timeToMilliSeconds(end);
  return startTime <= targetTime && targetTime <= endTime;
}

export function timeToMilliSeconds(time) {
  const [hourMin, period] = time.split(' ');
  const [hour, min] = hourMin.split(':');
  const convertedHour = hour === '12' ? 3600000 : 3600000 * parseInt(hour, 10);
  const convertedMin = 60000 * parseInt(min, 10);
  const convertedPeriod = period === 'AM' ? 0 : 43200000;

  return convertedHour + convertedMin + convertedPeriod;
}

export const contrivedDate = (date) => {
  const jsDate = new Date(date);
  const monthIdx = jsDate.getMonth();
  const dayIdx = jsDate.getDate();
  return zeroPaddingDates(monthIdx, dayIdx);
};

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
