import { io } from "socket.io-client";

const URL =
  import.meta.env.NODE_ENV === "production"
    ? "https://wiki-api.sheepwizard.com"
    : "https://wiki-api.sheepwizard.com";

export const socket = io(URL);
