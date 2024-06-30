import { addToUserRoute, createUser, getUserById, removeUser } from "./user";
import {
  addUserToRoom,
  checkWin,
  createRoom,
  getRoomById,
  removeUserFromRoom,
  resetRoom,
  roomPlay,
  roomSetEnd,
  roomSetStart,
} from "./room";
import { MySocket } from "./socket";
import z from "zod";

function handleRoomCreate(socket: MySocket, userName: string) {
  const validator = z.string().max(25);
  const result = validator.safeParse(userName);
  if (!result.success) {
    //add error
    return;
  }

  const user = createUser(socket.data.userId, userName);
  const room = createRoom(user);
  addUserToRoom(socket, room, user);
}

function handleRoomJoin(socket: MySocket, roomId: string, userName: string) {
  const validator = z.object({
    roomId: z.string(),
    userName: z.string().max(25),
  });
  const result = validator.safeParse({
    roomId,
    userName,
  });
  if (!result.success) {
    //add error
    return;
  }

  const room = getRoomById(roomId);
  if (!room) {
    // add error
    console.log("No room found");
    return;
  }
  if (room.state !== "lobby") {
    // add error
    return;
  }

  if (room.users.length >= 100) {
    // add error
    return;
  }

  const user = createUser(socket.data.userId, userName);
  addUserToRoom(socket, room, user);
}

function handleRoomLeave(socket: MySocket) {
  const user = getUserById(socket.data.userId);
  if (!user) {
    console.log("No user");
    return;
  }
  removeUser(user.id);

  const room = getRoomById(user.roomId ?? "");
  if (!room) {
    return;
  }
  removeUserFromRoom(socket, room, user);
}

function handleRoomPlay(socket: MySocket, roomId: string) {
  const validator = z.string();
  const result = validator.safeParse(roomId);
  if (!result.success) {
    //add error
    return;
  }

  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = getUserById(socket.data.userId);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }

  room.users.forEach((user) => addToUserRoute(user, room.start));

  roomPlay(socket, room);
}

export function handleRoomSetStart(
  socket: MySocket,
  roomId: string,
  start: string
) {
  const validator = z.object({
    roomId: z.string(),
    start: z.string().max(500),
  });
  const result = validator.safeParse({
    roomId,
    start,
  });
  if (!result.success) {
    //add error
    return;
  }

  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = getUserById(socket.data.userId);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }
  start = start.replace(/\u00AD/g, "");
  roomSetStart(socket, room, start);
}

function handleRoomSetEnd(socket: MySocket, roomId: string, end: string) {
  const validator = z.object({
    roomId: z.string(),
    end: z.string().max(500),
  });
  const result = validator.safeParse({
    roomId,
    end,
  });
  if (!result.success) {
    //add error
    return;
  }

  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = getUserById(socket.data.userId);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }
  end = end.replace(/\u00AD/g, "");
  roomSetEnd(socket, room, end);
}

function handleUserRoute(socket: MySocket, roomId: string, route: string) {
  const validator = z.object({
    roomId: z.string(),
    route: z.string().max(500),
  });
  const result = validator.safeParse({
    roomId,
    route,
  });
  if (!result.success) {
    //add error
    return;
  }

  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "inGame") {
    return;
  }

  const user = getUserById(socket.data.userId);
  if (!user) {
    return;
  }

  const found = room.users.some((x) => x.id === user.id);
  if (!found) {
    return;
  }
  route = route.replace(/\u00AD/g, "");
  addToUserRoute(user, route);
  checkWin(socket, room, user, route);
}

function handleRoomLobby(socket: MySocket, roomId: string) {
  const validator = z.string();
  const result = validator.safeParse(roomId);
  if (!result.success) {
    //add error
    return;
  }

  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "endGame") {
    return;
  }

  const user = getUserById(socket.data.userId);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }

  resetRoom(socket, room);
}

export default function io(socket: MySocket) {
  return {
    handleRoomCreate: (userName: string) => handleRoomCreate(socket, userName),
    handleRoomJoin: (roomId: string, userName: string) =>
      handleRoomJoin(socket, roomId, userName),
    handleRoomLeave: () => handleRoomLeave(socket),
    handleRoomPlay: (roomId: string) => handleRoomPlay(socket, roomId),
    handleRoomSetStart: (roomId: string, start: string) =>
      handleRoomSetStart(socket, roomId, start),
    handleRoomSetEnd: (roomId: string, end: string) =>
      handleRoomSetEnd(socket, roomId, end),
    handleUserRoute: (roomId: string, route: string) =>
      handleUserRoute(socket, roomId, route),
    handleRoomLobby: (roomId: string) => handleRoomLobby(socket, roomId),
  };
}
