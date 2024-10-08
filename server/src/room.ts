import {
  User,
  userClearRoutes,
  userReadyUp,
  userSurrender,
  WikiPage,
} from "./user.js";
import { MySocket } from "./socket.js";
import { customAlphabet } from "nanoid";

export interface Room {
  id: string;
  users: User[];
  disconnectedUsers: User[];
  state: "lobby" | "inGame" | "endGame";
  roomOwnerId: string;
  start: WikiPage;
  end: WikiPage;
  startTime: Date;
  endTime: Date;
  winnerUserId?: string;
  rules: {
    excludeGroups: string[];
    noPageSearch: boolean;
  };
}
const nanoid = customAlphabet(
  "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM",
  8
);

export const rooms: Map<string, Room> = new Map();

export function roomCreate(user: User) {
  const roomId = nanoid();

  const room: Room = {
    id: roomId,
    users: [],
    disconnectedUsers: [],
    state: "lobby",
    roomOwnerId: user.id,
    start: {
      title: "Dog",
      pageId: 4269567,
    },
    end: {
      title: "Cat",
      pageId: 6678,
    },
    startTime: new Date(),
    endTime: new Date(),
    rules: {
      excludeGroups: [],
      noPageSearch: false,
    },
  };
  rooms.set(roomId, room);
  return room;
}

export function roomAddUser(socket: MySocket, room: Room, user: User) {
  room.users.push(user);
  user.roomId = room.id;
  socket.join(room.id);
  socket.emit("room:update", room);

  socket.to(room.id).emit("room:update", room);
}

export function roomReAddUser(socket: MySocket, room: Room, user: User) {
  room.disconnectedUsers = room.disconnectedUsers.filter(
    (x) => x.id !== user.id
  );
  roomAddUser(socket, room, user);
}

export function roomRemoveUser(
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

export function roomGetById(id: string) {
  return rooms.get(id);
}

export function roomPlay(socket: MySocket, room: Room) {
  room.state = "inGame";
  room.startTime = new Date();
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomSetStart(socket: MySocket, room: Room, start: WikiPage) {
  room.start = start;
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomSetEnd(socket: MySocket, room: Room, end: WikiPage) {
  room.end = end;
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomEndGame(socket: MySocket, room: Room, winnerUser?: User) {
  room.state = "endGame";
  room.endTime = new Date();
  room.winnerUserId = winnerUser?.id;
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomCheckWin(room: Room, route: WikiPage) {
  return room.end.pageId === route.pageId;
}

export function roomReset(socket: MySocket, room: Room) {
  room.state = "lobby";
  room.winnerUserId = "";
  room.disconnectedUsers = [];
  for (const user of room.users) {
    userClearRoutes(user);
    userReadyUp(user, false);
    userSurrender(user, false);
  }
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomUserReadyUp(socket: MySocket, room: Room, user: User) {
  userReadyUp(user, !user.ready);
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomUserSurrender(socket: MySocket, room: Room, user: User) {
  userSurrender(user, !user.surrendered);
  socket.nsp.to(room.id).emit("room:update", room);
}

export function roomToggleExcludeGroup(
  socket: MySocket,
  room: Room,
  excludeGroup: string
) {
  // Check exclude group is valid
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
