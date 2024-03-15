import { Socket, io } from "socket.io-client";
import LocalStorage from "./LocalStorage";
export default class SocketGlobal {
  private static instances: Map<string, Socket> = new Map<string, Socket>();
  private constructor() { }

  public static getInstance(symbol: string): Socket {
    if (!SocketGlobal.instances.has(symbol)) {

      SocketGlobal.instances.set(symbol, io(process.env.REACT_APP_SOCKET_URL, {
        // path: "/ws",
        // autoConnect: false,
        extraHeaders: {
          uid: LocalStorage.getUid(),
          access_token: LocalStorage.getAccessToken(),
          pair: symbol,
        },
      }));
    }

    return SocketGlobal.instances.get(symbol) as Socket;
  }
}
