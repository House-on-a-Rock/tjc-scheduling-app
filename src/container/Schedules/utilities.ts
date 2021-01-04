import { DayIndexOptions } from '../../shared/types';

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

export const memoizeData = (data: any) => {
  const makeDataLevel = () => data;
  return makeDataLevel();
};
