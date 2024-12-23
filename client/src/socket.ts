import { Socket } from "socket.io-client";
import {
  Room,
  RoomChatMessage,
  RoomPartial,
  RoomSystemChatMessage,
  WikiPage,
} from "./types";

export interface ClientToServerEvents {
  "room:create": (userName: string) => void;
  "room:join": (roomId: string, userName: string) => void;
  "room:play": (roomId: string) => void;
  "room:pause": (roomId: string) => void;
  "room:set:start": (roomId: string, start: WikiPage) => void;
  "room:set:end": (roomId: string, end: WikiPage) => void;
  "room:user:route": (roomId: string, route: WikiPage) => void;
  "room:user:readyUp": (roomId: string) => void;
  "room:user:surrender": (roomId: string) => void;
  "room:rules:updateRules": (roomId: string, rules: Room["rules"]) => void;
  "room:rules:updateAdminRules": (
    roomId: string,
    rules: Room["adminRules"]
  ) => void;
  "room:lobby": (roomId: string) => void;
  "room:chat": (roomId: string, message: string) => void;
  "room:leave": () => void;
  disconnect: () => void;
}

export interface ServerToClientEvents {
  "room:update": (room: Room) => void;
  "room:partial:update": (room: RoomPartial) => void;
  "room:chat:update": (chat: RoomChatMessage | RoomSystemChatMessage) => void;
  session: (sessionId: string, userId: string) => void;
}

export type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const URL =
  import.meta.env.PROD === true
    ? "https://wiki-api.sheepwizard.com"
    : "http://localhost:3001";
