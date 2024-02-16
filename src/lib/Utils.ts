import EventEmitter from "events";
import LocalStorage from "./LocalStorage";

export function isMobile() {
  return window.innerWidth <= 820;
}

export function getEventEmitter() {
  //@ts-ignore
  if (!window.eventEmitter)
    //@ts-ignore
    window.eventEmitter = new EventEmitter();
  //@ts-ignore
  return window.eventEmitter;
}

export function hideLoader() {
  const loader = document.querySelector(".loader");
  if (loader) {
    //@ts-ignore
    loader.style.opacity = "0";
    setTimeout(() => {
      //@ts-ignore
      loader.style.display = "none";
    }, 1000);
  }
}
export function showLoader(reload: boolean = false) {
  const loader = document.querySelector(".loader");
  if (loader) {
    //@ts-ignore
    loader.style.opacity = "1";
    //@ts-ignore
    loader.style.display = "block";
    if (reload) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }
}

export function validAlpha(str: string) {
  return /[a-z]+$/gi.test(str);
}

export function passwordValidator(str: string) {
  if (!String(str).length) {
    return "Please enter your password";
  }
  if (str.length < 8) {
    return "Password too short";
  }
  if (!/[a-z]/gi.test(str)) {
    return "Please use the Latin letters and any of the following special symbols: !#$%&'()*+,-./:;<=>?@[]^_`{|}~№£";
  }
  if (
    !/[0-9]/gi.test(str) &&
    !/[!#$%&'()*+,-./:;<=>?@[]^_`{|}~№£]/gi.test(str)
  ) {
    return "Please add a number or a special symbol (e.g., 1 or &)";
  }
  return null;
}

export function emailValidator(str: string) {
  if (!String(str).length) {
    return "Please specify the required information";
  }
  if (
    !String(str)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    return "Please enter a valid email. For example, example@gmail.com";
  }
  return null;
}

export function isAccountDemo() {
  return LocalStorage.get("uid", "")?.indexOf("demo") === 0;
}
