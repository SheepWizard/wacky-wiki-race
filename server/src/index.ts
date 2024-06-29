import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import roomHandler from "./roomHandler";
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://wiki.sheepwizard.com"], //change me
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const {
    handleRoomCreate,
    handleRoomJoin,
    handleRoomLeave,
    handleRoomPlay,
    handleRoomSetStart,
    handleRoomSetEnd,
    handleUserRoute,
    handleRoomLobby,
  } = roomHandler(socket);

  socket.on("room:create", handleRoomCreate);
  socket.on("room:join", handleRoomJoin);
  socket.on("room:play", handleRoomPlay);
  socket.on("room:set:start", handleRoomSetStart);
  socket.on("room:set:end", handleRoomSetEnd);
  socket.on("room:user:route", handleUserRoute);
  socket.on("room:lobby", handleRoomLobby);
  socket.on("room:leave", handleRoomLeave);
  socket.on("disconnect", handleRoomLeave);
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
