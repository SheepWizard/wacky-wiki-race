import { Socket } from "socket.io-client";
import { Room } from "./types";

export interface ClientToServerEvents {
  "room:create": (userName: string) => void;
  "room:join": (roomId: string, userName: string) => void;
  "room:play": (roomId: string) => void;
  "room:set:start": (roomId: string, start: string) => void;
  "room:set:end": (roomId: string, end: string) => void;
  "room:user:route": (roomId: string, route: string) => void;
  "room:lobby": (roomId: string) => void;
  "room:leave": () => void;
  disconnect: () => void;
}

export interface ServerToClientEvents {
  "room:update": (room: Room) => void;
  session: (sessionId: string, userId: string) => void;
}

export type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const URL =
  import.meta.env.NODE_ENV === "production"
    ? "https://wiki-api.sheepwizard.com"
    : "https://wiki-api.sheepwizard.com";
