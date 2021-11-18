import { axios } from 'lib/axios';

export function recoverEmail(email) {
  return axios.post('/api/auth/sendResetEmail', email);
}

export function checkResetToken(token) {
  return axios.get('/api/auth/checkResetToken', {
    headers: { authorization: token },
  });
}

export function authenticate({ email, password }) {
  return axios.post('/api/auth/login', { email, password });
}

export function sendNewPassword(token, newPassword) {
  return axios.post(
    '/api/auth/resetPassword',
    { email: 'shaun.tung@gmail.com', password: newPassword },
    { headers: { authorization: token } },
  );
}
