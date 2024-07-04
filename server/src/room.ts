import { clearRoutes, readyUp, surrender, User } from "./user.js";
import { MySocket } from "./socket.js";
import { customAlphabet } from "nanoid";

export interface Room {
  id: string;
  users: User[];
  disconnectedUsers: User[];
  state: "lobby" | "inGame" | "endGame";
  roomOwnerId: string;
  start: string;
  end: string;
  startTime: Date;
  endTime: Date;
  winnerUserId?: string;
  rules: {
    excludeGroups: string[];
  };
}
const nanoid = customAlphabet(
  "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM",
  8
);

export const rooms: Map<string, Room> = new Map();

export function createRoom(user: User) {
  const roomId = nanoid();

  const room: Room = {
    id: roomId,
    users: [],
    disconnectedUsers: [],
    state: "lobby",
    roomOwnerId: user.id,
    start: "Dog",
    end: "Cat",
    startTime: new Date(),
    endTime: new Date(),
    rules: {
      excludeGroups: [],
    },
  };
  rooms.set(roomId, room);
  return room;
}

export function addUserToRoom(socket: MySocket, room: Room, user: User) {
  room.users.push(user);
  user.roomId = room.id;
  socket.join(room.id);
  socket.emit("room:update", room);

  socket.to(room.id).emit("room:update", room);
}

export function reAddUserToRoom(socket: MySocket, room: Room, user: User) {
  room.disconnectedUsers = room.disconnectedUsers.filter(
    (x) => x.id !== user.id
  );
  addUserToRoom(socket, room, user);
}

export function removeUserFromRoom(
  socket: MySocket,
  room: Room,
  user: User,
  disconnected: boolean
) {
  const updatedUsers = room.users.filter((x) => x.id !== user.id);
  room.users = updatedUsers;
  if (disconnected) {
    room.disconnectedUsers.push(user);
  }
  socket.leave(room.id);

  if (!room.users.length) {
    return;
  }

  if (user.id === room.roomOwnerId) {
    room.roomOwnerId = room.users[0].id;
  }
  socket.to(room.id).emit("room:update", room);
}

export function getRoomById(id: string) {
  return rooms.get(id);
}

export function roomPlay(socket: MySocket, room: Room) {
  room.state = "inGame";
  room.startTime = new Date();
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomSetStart(socket: MySocket, room: Room, start: string) {
  room.start = start;
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomSetEnd(socket: MySocket, room: Room, end: string) {
  room.end = end;
  socket.nsp.to(room.id).emit("room:update", room);
}

export function checkWin(
  socket: MySocket,
  room: Room,
  user: User,
  route: string
) {
  if (room.end !== route) {
    return;
  }

  room.state = "endGame";
  room.endTime = new Date();
  room.winnerUserId = user.id;
  socket.nsp.to(room.id).emit("room:update", room);
}

export function resetRoom(socket: MySocket, room: Room) {
  room.state = "lobby";
  room.winnerUserId = "";
  room.disconnectedUsers = [];
  for (const user of room.users) {
    clearRoutes(user);
    readyUp(user, false);
    surrender(user, false);
  }
  socket.nsp.to(room.id).emit("room:update", room);
}

export function userReadyUp(socket: MySocket, room: Room, user: User) {
  readyUp(user, !user.ready);
  socket.nsp.to(room.id).emit("room:update", room);
}

export function userSurrender(socket: MySocket, room: Room, user: User) {
  surrender(user, !user.surrendered);
  socket.nsp.to(room.id).emit("room:update", room);
}

export function toggleExcludeGroup(
  socket: MySocket,
  room: Room,
  excludeGroup: string
) {
  const containsGroup = room.rules.excludeGroups.includes(excludeGroup);

  if (!containsGroup) {
    room.rules.excludeGroups.push(excludeGroup);
  } else {
    room.rules.excludeGroups = room.rules.excludeGroups.filter(
      (x) => x !== excludeGroup
    );
  }
  socket.nsp.to(room.id).emit("room:update", room);
}
