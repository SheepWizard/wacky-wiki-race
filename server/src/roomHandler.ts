import { Socket } from "socket.io";
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

function handleRoomCreate(socket: Socket, userName: string) {
  const user = createUser(socket.id, userName);
  const room = createRoom(user);
  addUserToRoom(socket, room, user);
}

function handleRoomJoin(socket: Socket, roomId: string, userName: string) {
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

  const user = createUser(socket.id, userName);
  addUserToRoom(socket, room, user);
}

function handleRoomLeave(socket: Socket) {
  const user = getUserById(socket.id);
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

function handleRoomPlay(socket: Socket, roomId: string) {
  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = getUserById(socket.id);
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
  socket: Socket,
  roomId: string,
  start: string
) {
  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = getUserById(socket.id);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }
  start = start.replace(/\u00AD/g, "");
  roomSetStart(socket, room, start);
}

function handleRoomSetEnd(socket: Socket, roomId: string, end: string) {
  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = getUserById(socket.id);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }
  end = end.replace(/\u00AD/g, "");
  roomSetEnd(socket, room, end);
}

function handleUserRoute(socket: Socket, roomId: string, route: string) {
  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "inGame") {
    return;
  }

  const user = getUserById(socket.id);
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

function handleRoomLobby(socket: Socket, roomId: string) {
  const room = getRoomById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "endGame") {
    return;
  }

  const user = getUserById(socket.id);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }

  resetRoom(socket, room);
}

export default function io(socket: Socket) {
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
