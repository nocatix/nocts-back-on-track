import {
  setCookie,
  getCookie,
  deleteCookie,
  getAllSettings,
  saveAllSettings,
} from '../../utils/cookieHelper';

// Helper to wipe a cookie between tests so tests don't bleed into each other.
const clearCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

describe('setCookie / getCookie', () => {
  afterEach(() => {
    clearCookie('testCookie');
  });

  it('stores and retrieves a string value', () => {
    setCookie('testCookie', 'hello', 1);
    expect(getCookie('testCookie')).toBe('hello');
  });

  it('stores and retrieves an object value', () => {
    const obj = { token: 'abc123', userId: 42 };
    setCookie('testCookie', obj, 1);
    expect(getCookie('testCookie')).toEqual(obj);
  });

  it('stores and retrieves a boolean value', () => {
    setCookie('testCookie', true, 1);
    expect(getCookie('testCookie')).toBe(true);
  });

  it('stores and retrieves a numeric value', () => {
    setCookie('testCookie', 99, 1);
    expect(getCookie('testCookie')).toBe(99);
  });
});

describe('getCookie', () => {
  it('returns null for a non-existent cookie', () => {
    expect(getCookie('__nonexistent_cookie__')).toBeNull();
  });
});

describe('deleteCookie', () => {
  it('removes a previously set cookie', () => {
    setCookie('delTest', { a: 1 }, 1);
    expect(getCookie('delTest')).toEqual({ a: 1 });
    deleteCookie('delTest');
    expect(getCookie('delTest')).toBeNull();
  });
});

describe('getAllSettings', () => {
  afterEach(() => {
    ['loginInfo', 'darkMode', 'sidebarCollapsed', 'hintStates'].forEach(clearCookie);
  });

  it('returns all null values when no settings are set', () => {
    const settings = getAllSettings();
    expect(settings).toEqual({
      loginInfo: null,
      darkMode: null,
      sidebarCollapsed: null,
      hintStates: null,
    });
  });

  it('returns set cookie values for each key', () => {
    setCookie('darkMode', true, 1);
    setCookie('sidebarCollapsed', false, 1);
    const settings = getAllSettings();
    expect(settings.darkMode).toBe(true);
    expect(settings.sidebarCollapsed).toBe(false);
    expect(settings.loginInfo).toBeNull();
    expect(settings.hintStates).toBeNull();
  });
});

describe('saveAllSettings', () => {
  afterEach(() => {
    ['loginInfo', 'darkMode', 'sidebarCollapsed', 'hintStates'].forEach(clearCookie);
  });

  it('saves loginInfo when provided', () => {
    saveAllSettings({ loginInfo: { token: 'tok1' } });
    expect(getCookie('loginInfo')).toEqual({ token: 'tok1' });
  });

  it('saves darkMode when provided', () => {
    saveAllSettings({ darkMode: true });
    expect(getCookie('darkMode')).toBe(true);
  });

  it('saves sidebarCollapsed when provided', () => {
    saveAllSettings({ sidebarCollapsed: false });
    expect(getCookie('sidebarCollapsed')).toBe(false);
  });

  it('saves hintStates when provided', () => {
    const hints = { welcome: true, tour: false };
    saveAllSettings({ hintStates: hints });
    expect(getCookie('hintStates')).toEqual(hints);
  });

  it('does not overwrite cookies not included in settings', () => {
    setCookie('darkMode', false, 1);
    saveAllSettings({ loginInfo: { token: 'tok2' } });
    // darkMode should remain untouched
    expect(getCookie('darkMode')).toBe(false);
    expect(getCookie('loginInfo')).toEqual({ token: 'tok2' });
  });
});
