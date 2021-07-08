import { useLocation } from 'react-router-dom';

export function errorDataExtractor(error) {
  return {
    message: error.response?.data?.message,
    status: error.response?.status,
  };
}

export const useQuery = () => new URLSearchParams(useLocation().search);

export const getLocalStorageItem = (key) => {
  const storedContent = JSON.parse(localStorage.getItem(key));
  return !storedContent
    ? null
    : typeof storedContent === 'string'
    ? { token: storedContent }
    : storedContent;
};

export const setLocalStorageState = (key, newState) =>
  localStorage.setItem(key, JSON.stringify(newState));

export const removeLocalStorageState = (type) => localStorage.removeItem(`${type}_state`);

export function isValidEmail(emailValue) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // I changed this, this needs to be tested
  return re.test(String(emailValue).toLowerCase());
}

// needed to format date so that the date picker can display it properly
export function toDateString(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const stringLengthCheck = (title) => title.length === 0 || title.length >= 32;

export function zeroPaddedDateString(date) {
  // need to pad months/dates with 0s if single digit
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;
  return `${date.getFullYear()}-${month}-${day}`;
}

function replaceDashesInDates(date) {
  return date.replace(/-/g, '/');
}

export function incrementDate(date) {
  const s = date.replace(/-/g, '/');
  const d = new Date(s);
  d.setDate(d.getDate() + 1);
  return d;
}

// copied from backend
function zeroPaddingDates(date) {
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;

  return `${month}/${day}`;
}

export function formatDates(weekRange) {
  const r = weekRange.map((week) => {
    const start = zeroPaddingDates(week.start);
    const end = zeroPaddingDates(week.end);

    const returnstring = start === end ? `${start}` : `${start} - ${end}`;
    return { Header: returnstring };
  });
  return r;
}

export function createColumns(weekRange) {
  return [
    { Header: '' },
    { Header: 'Time' },
    { Header: 'Duty' },
    ...formatDates(weekRange),
  ];
}

export function areDatesEqual(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function weeksRange(startDate, endDate) {
  // js dates are stupid and I hate them. They won't do the right operations in '2020-06-21' format
  // have to convert them to '2020/06/21'
  const start = new Date(replaceDashesInDates(startDate));
  const end = new Date(replaceDashesInDates(endDate));
  const weekArray = [];
  const currentDate = new Date(start);
  const currentObj = { start: start };

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= end) {
    if (currentDate.getDay() === 0) {
      currentObj.start = new Date(currentDate);
    } else if (currentDate.getDay() === 6) {
      currentObj.end = new Date(currentDate);
      weekArray.push({ ...currentObj });
    } else if (areDatesEqual(currentDate, end)) {
      currentObj.end = new Date(currentDate);
      weekArray.push({ ...currentObj });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return weekArray;
}
