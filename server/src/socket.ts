import { Socket } from "socket.io";
import { Room, RoomPartial } from "./room.js";
import { WikiPage } from "./user.js";

export interface ClientToServerEvents {
  "room:create": (userName: string) => void;
  "room:join": (roomId: string, userName: string) => void;
  "room:play": (roomId: string) => void;
  "room:set:start": (roomId: string, start: WikiPage) => void;
  "room:set:end": (roomId: string, end: WikiPage) => void;
  "room:user:route": (roomId: string, route: WikiPage) => void;
  "room:user:readyUp": (roomId: string) => void;
  "room:user:surrender": (roomId: string) => void;
  "room:rules:updateRules": (roomId: string, rules: Room["rules"]) => void;
  "room:lobby": (roomId: string) => void;
  "room:chat": (roomId: string, message: string) => void;
  "room:leave": () => void;
  disconnect: () => void;
}

export interface ServerToClientEvents {
  "room:update": (room: Room) => void;
  "room:partial:update": (room: RoomPartial) => void;
  "room:chat:update": (chat: Room["chat"]) => void;
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
