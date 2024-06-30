import { io } from "socket.io-client";

const URL =
  import.meta.env.NODE_ENV === "production"
    ? "https://wiki-api.sheepwizard.com"
    : "http://localhost:3001";

export const socket = io(URL);
