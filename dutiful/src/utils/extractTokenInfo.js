import jwtDecode from 'jwt-decode';

export function extractTokenInfo(jwt, target) {
  if (!jwt) return null;
  const decodedToken = jwtDecode(jwt);
  if (!decodedToken) return null;
  const { sub, access, exp } = decodedToken;
  switch (target) {
    case 'user':
      return JSON.parse(sub.split('|')[1]);
    case 'access':
      const extractedAccess = access.split('|');
      return extractedAccess;
    case 'exp':
      const extractedExp = exp;
      return [extractedExp];
    default:
      return null;
  }
}
