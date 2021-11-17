const storagePrefix = 'dutiful_';

export const tokenStorage = {
  getToken: () => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}token`));
  },
  setToken: (token) => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },
};

export const loginCredStorage = {
  getCredentials: () => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}credentials`));
  },
  setCredentials: (cred) => {
    window.localStorage.setItem(`${storagePrefix}credentials`, JSON.stringify(cred));
  },
  clearCredentials: () => {
    window.localStorage.removeItem(`${storagePrefix}credentials`);
  },
};
