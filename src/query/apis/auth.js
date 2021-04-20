import axios from 'axios';
import { secretIp } from '../../../secrets/secretStuff';

export function recoverEmail(email) {
  return axios.post(`${secretIp}/api/authentication/sendResetEmail`, {
    email: email,
  });
}

export function checkResetToken(token) {
  return axios.get(`${secretIp}/api/authentication/checkResetToken`, {
    headers: { authorization: token },
  });
}

export function authenticateLogin(email, password) {
  return axios.post(`${secretIp}/api/authentication/webLogin`, {
    email: email,
    password: password,
  });
}

export function sendNewPassword(token, newPassword) {
  return axios.post(
    `${secretIp}/api/authentication/resetPassword`,
    { email: 'shaun.tung@gmail.com', password: newPassword },
    { headers: { authorization: token } },
  );
}
