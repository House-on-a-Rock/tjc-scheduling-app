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

export function incrementDate(date) {
  const s = date.replace(/-/g, '/');
  const d = new Date(s);
  d.setDate(d.getDate() + 1);
  return d;
}
