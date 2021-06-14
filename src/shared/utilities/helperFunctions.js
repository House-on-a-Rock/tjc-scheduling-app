import { useLocation } from 'react-router-dom';

export function errorDataExtractor(error) {
  return {
    message: error.response?.data?.message,
    status: error.response?.status,
  };
}

export const getURLParams = () => new URLSearchParams(useLocation().search);

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
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // I changed this, this needs to be tested
  return re.test(String(emailValue).toLowerCase());
}

// needed to format date so that the date picker can display it properly
export function toDateString(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const stringLengthCheck = (title) => title.length === 0 || title.length >= 32;
