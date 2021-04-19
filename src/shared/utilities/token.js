/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import jwtDecode from 'jwt-decode';
import { JWTDataType } from '../types';
import { getLocalStorageItem } from './helperFunctions';

export function extractTokenInfo(jwt: string, target: string): string[] | null {
  if (!jwt) return null;
  const decodedAccessKey = jwtDecode(jwt) as JWTDataType;
  if (!decodedAccessKey) return null;
  switch (target) {
    case 'userId':
      const extractedUserId = decodedAccessKey.sub.split('|')[1];
      return [extractedUserId];
    case 'churchId':
      const extractedChurchId = decodedAccessKey.sub.split('|')[2];
      return [extractedChurchId];
    case 'access':
      const extractedAccess = decodedAccessKey.access.split('|');
      return extractedAccess;
    case 'exp':
      const extractedExp = decodedAccessKey.exp;
      return [extractedExp];
    default:
      return null;
  }
}

export const useToken: () => string | null = () =>
  getLocalStorageItem('access_token')?.token;

// export const extractedChurchId = parseInt(extractTokenInfo(token, 'churchId')[0], 10);

// export const getUserId: number = parseInt(
//   extractTokenInfo(getLocalStorageItem('access_token'), 'userId')[0],
//   10,
// );

// export const getAccess: number = parseInt(
//   extractTokenInfo(getLocalStorageItem('access_token'), 'access')[0],
//   10,
// );
