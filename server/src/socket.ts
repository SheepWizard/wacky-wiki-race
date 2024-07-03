import { Socket } from "socket.io";
import { Room } from "./room.js";

export interface ClientToServerEvents {
  "room:create": (userName: string) => void;
  "room:join": (roomId: string, userName: string) => void;
  "room:play": (roomId: string) => void;
  "room:set:start": (roomId: string, start: string) => void;
  "room:set:end": (roomId: string, end: string) => void;
  "room:user:route": (roomId: string, route: string) => void;
  "room:user:readyUp": (roomId: string) => void;
  "room:user:surrender": (roomId: string) => void;
  "room:rules:excludeGroup": (roomId: string, excludeGroup: string) => string;
  "room:lobby": (roomId: string) => void;
  "room:leave": () => void;
  disconnect: () => void;
}

export interface ServerToClientEvents {
  "room:update": (room: Room) => void;
  session: (sessionId: string, userId: string) => void;
}

export interface SocketData {
  sessionId: string;
  userId: string;
}

export type MySocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  any,
  SocketData
>;
