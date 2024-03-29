import axios from 'axios';
export const secretIp = 'http://localhost:8081';

export function recoverEmail(email) {
  return axios.post(`${secretIp}/api/auth/sendResetEmail`, email);
}

export function checkResetToken(token) {
  return axios.get(`${secretIp}/api/auth/checkResetToken`, {
    headers: { authorization: token },
  });
}

export function authenticate({ email, password }) {
  return axios.post(`${secretIp}/api/auth/login`, { email, password });
}

export function sendNewPassword(token, newPassword) {
  return axios.post(
    `${secretIp}/api/auth/resetPassword`,
    { email: 'shaun.tung@gmail.com', password: newPassword },
    { headers: { authorization: token } },
  );
}
