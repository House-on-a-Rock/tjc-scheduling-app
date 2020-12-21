/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { HttpResponseStatus, JWTDataType } from '../types/models';

export function errorDataExtractor(error: any): HttpResponseStatus {
  return {
    message: error.response?.data?.message,
    status: error.response?.status,
  };
}

export const useQuery = () => new URLSearchParams(useLocation().search);

export const getLocalStorageItem = (key: string) => {
  return JSON.parse(localStorage.getItem(key) ?? '{}');
};

export const setLocalStorageState = (key: string, newState: object) =>
  localStorage.setItem(key, JSON.stringify(newState));

export const removeLocalStorageState = (type: string) =>
  localStorage.removeItem(`${type}_state`);

export function isValidEmail(emailValue: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // I changed this, this needs to be tested
  return re.test(String(emailValue).toLowerCase());
}

export function extractTokenInfo(jwt: string, target: string): number | null {
  const decodedAccessKey = jwtDecode(jwt) as JWTDataType;
  if (!decodedAccessKey) return null;
  switch (target) {
    case 'userId':
      const extractedId = parseInt(decodedAccessKey.sub.split('|')[1], 10);
      return extractedId;
    case 'access':
      return parseInt(decodedAccessKey.access, 10);
    default:
      return null;
  }
}

// needed to format date so that the date picker can display it properly
export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
