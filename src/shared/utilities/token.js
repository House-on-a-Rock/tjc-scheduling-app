/* eslint-disable no-case-declarations */
import jwtDecode from 'jwt-decode';
import { getLocalStorageItem } from './helperFunctions';

export function extractTokenInfo(jwt, target) {
  if (!jwt) return null;
  const decodedAccessKey = jwtDecode(jwt);
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

export const useToken = () => getLocalStorageItem('access_token')?.token;

// export const extractedChurchId = parseInt(extractTokenInfo(token, 'churchId')[0], 10);

// export const getUserId = parseInt(
//   extractTokenInfo(getLocalStorageItem('access_token'), 'userId')[0],
//   10,
// );

// export const getAccess = parseInt(
//   extractTokenInfo(getLocalStorageItem('access_token'), 'access')[0],
//   10,
// );
