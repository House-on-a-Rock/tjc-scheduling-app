import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';

export function recoverEmail(email) {
  return axios.post(`${secretIp}/api/auth/sendResetEmail`, {
    email: email,
  });
}

export function checkResetToken(token) {
  return axios.get(`${secretIp}/api/auth/checkResetToken`, {
    headers: { authorization: token },
  });
}

export function authenticateLogin(email, password) {
  return axios.post(`${secretIp}/api/auth/webLogin`, {
    email: email,
    password: password,
  });
}

export function sendNewPassword(token, newPassword) {
  return axios.post(
    `${secretIp}/api/auth/resetPassword`,
    { email: 'shaun.tung@gmail.com', password: newPassword },
    { headers: { authorization: token } },
  );
}
