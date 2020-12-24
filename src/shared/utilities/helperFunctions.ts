/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { useLocation } from 'react-router-dom';
import { HttpResponseStatus } from '../types/models';

export function errorDataExtractor(error: any): HttpResponseStatus {
  return {
    message: error.response?.data?.message,
    status: error.response?.status,
  };
}

export const useQuery = () => new URLSearchParams(useLocation().search);

export const getLocalStorageItem = (key: string) => {
  const storedContent = JSON.parse(localStorage.getItem(key));
  return !storedContent
    ? null
    : typeof storedContent === 'string'
    ? { token: storedContent }
    : storedContent;
};

export const setLocalStorageState = (key: string, newState: object) =>
  localStorage.setItem(key, JSON.stringify(newState));

export const removeLocalStorageState = (type: string) =>
  localStorage.removeItem(`${type}_state`);

export function isValidEmail(emailValue: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // I changed this, this needs to be tested
  return re.test(String(emailValue).toLowerCase());
}

// needed to format date so that the date picker can display it properly
export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const stringLengthCheck: (arg: string) => boolean = (title: string) =>
  title.length === 0 || title.length >= 32;
