import { tryParse } from "./StrUtils";

const USER_SETTINGS = "user_settings";

class LocalStorage {
  static set(key: string, value: any) {
    return localStorage.setItem(key, value);
  }

  static get(key: string, defaultValue?: any) {
    const value = localStorage.getItem(key);
    if (typeof value === "undefined" && typeof defaultValue !== "undefined") {
      return defaultValue;
    }
    return value;
  }

  static remove(key: string) {
    return localStorage.removeItem(key);
  }

  static setJson(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  static getJson(key: string, defaultValue?: any) {
    const value = localStorage.getItem(key);
    if (!value && typeof defaultValue !== "undefined") {
      return tryParse(defaultValue);
    }
    return tryParse(value);
  }

  // User settings
  static setUserSettings(key: string, value: any) {
    let settings = this.getJson(USER_SETTINGS);
    if (!settings) {
      settings = { [key]: value };
    } else {
      settings[key] = value;
    }
    this.setJson(USER_SETTINGS, settings);
  }

  static getUserSettings(key: string, defaultValue?: any) {
    const settings = this.getJson(USER_SETTINGS);
    if (settings && typeof settings[key] !== "undefined") {
      return settings[key];
    }
    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    }
  }
}

export default LocalStorage;
