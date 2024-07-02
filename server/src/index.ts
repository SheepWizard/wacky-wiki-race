import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import {
  handleRoomCreate,
  handleRoomJoin,
  handleRoomLeave,
  handleRoomLobby,
  handleRoomPlay,
  handleRoomReJoin,
  handleRoomSetEnd,
  handleRoomSetStart,
  handleUserRoute,
} from "./roomHandler.js";
import {
  getSession,
  sessionMiddleware,
} from "./middleware/sessionMiddleware.js";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./socket.js";
const app = express();

const server = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  any,
  SocketData
>(server, {
  cors: {
    origin: ["http://localhost:5173", "https://wiki.sheepwizard.com"], //change me
    methods: ["GET", "POST"],
  },
});

io.use(sessionMiddleware);

io.on("connection", (socket) => {
  socket.emit("session", socket.data.sessionId, socket.data.userId);

  const session = getSession(socket.data.sessionId);

  if (session?.oldRoomId) {
    handleRoomReJoin(socket, session.oldRoomId);
    session.oldRoomId = undefined;
  }

  socket.on("room:create", (...input) => handleRoomCreate(socket, ...input));
  socket.on("room:join", (...input) => handleRoomJoin(socket, ...input));
  socket.on("room:play", (...input) => handleRoomPlay(socket, ...input));
  socket.on("room:set:start", (...input) =>
    handleRoomSetStart(socket, ...input)
  );
  socket.on("room:set:end", (...input) => handleRoomSetEnd(socket, ...input));
  socket.on("room:user:route", (...input) => handleUserRoute(socket, ...input));
  socket.on("room:lobby", (...input) => handleRoomLobby(socket, ...input));
  socket.on("room:leave", () => handleRoomLeave(socket, false));
  socket.once("disconnect", () => handleRoomLeave(socket, true));
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
