import { Socket, io } from "socket.io-client";
import { STORE_UID, STORE_AUTH_TOKEN } from "./Const";
import { genUID } from "./StrUtils";
export default class SocketGlobal {
  private static instance: Socket;

  private constructor() {}

  public static getInstance(symbol: string): Socket {
    if (!SocketGlobal.instance) {
      let uid = localStorage.getItem(STORE_UID);
      if (!uid) {
        uid = "demo_" + genUID();
        localStorage.setItem(STORE_UID, uid);
      }
      SocketGlobal.instance = io(process.env.REACT_APP_SOCKET_URL, {
        // path: "/ws",
        // autoConnect: false,
        extraHeaders: {
          uid: uid,
          authToken: localStorage.getItem(STORE_AUTH_TOKEN) || "",
          pair: symbol,
        },
      });
    }

    return SocketGlobal.instance;
  }

  public static getSocket() {
    return this.instance;
  }
}
