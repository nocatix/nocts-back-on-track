// Cookie helper functions
export const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
};

export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(cookie.substring(nameEQ.length));
      } catch (error) {
        console.error(`Error parsing cookie ${name}:`, error);
        return null;
      }
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

export const getAllSettings = () => {
  return {
    loginInfo: getCookie('loginInfo'),
    darkMode: getCookie('darkMode'),
    sidebarCollapsed: getCookie('sidebarCollapsed'),
    hintStates: getCookie('hintStates'),
  };
};

export const saveAllSettings = (settings) => {
  if (settings.loginInfo) setCookie('loginInfo', settings.loginInfo);
  if (settings.darkMode !== undefined) setCookie('darkMode', settings.darkMode);
  if (settings.sidebarCollapsed !== undefined) setCookie('sidebarCollapsed', settings.sidebarCollapsed);
  if (settings.hintStates) setCookie('hintStates', settings.hintStates);
};
