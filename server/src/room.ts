import { customAlphabet } from "nanoid";
import { roomStore, watchProxy } from "./keyStore.js";
import { MySocket } from "./socket.js";
import {
  User,
  userClearRoutes,
  userReadyUp,
  userRemove,
  userSurrender,
  WikiPage,
} from "./user.js";

export interface RoomChatMessage {
  __type: "userChat";
  userId: string;
  userName: string;
  message: string;
}

export interface RoomSystemChatMessage {
  __type: "systemChat";
  message: string;
}

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
    noPageSearch: boolean;
    noNavBox: boolean;
  };
  chat: Array<RoomChatMessage | RoomSystemChatMessage>;
  lastAccessed: Date;
}

export interface RoomPartial extends Omit<Room, "chat" | "disconnectedUsers"> {}

const nanoid = customAlphabet(
  "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM",
  8
);

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
      noPageSearch: false,
      noNavBox: false,
    },
    chat: [],
    lastAccessed: new Date(),
  };

  const roomProxy = watchProxy(room);

  roomStore.set(roomId, roomProxy);
  return room;
}

export function roomAddUser(socket: MySocket, room: Room, user: User) {
  room.users.push(user);
  user.roomId = room.id;
  socket.join(room.id);
  socket.emit("room:update", room);

  socket.to(room.id).emit("room:update", room);
  roomSystemChat(socket, room, `${user.userName} joined the lobby!`);
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
  roomSystemChat(socket, room, `${user.userName} left the lobby!`);
}

export function roomGetById(id: string) {
  return roomStore.get(id);
}

export function roomPlay(socket: MySocket, room: Room) {
  room.state = "inGame";
  room.startTime = new Date();
  roomSendPartialUpdate(socket, room);
}

export function roomSetStart(socket: MySocket, room: Room, start: WikiPage) {
  room.start = start;
  roomSendPartialUpdate(socket, room);
}

export function roomSetEnd(socket: MySocket, room: Room, end: WikiPage) {
  room.end = end;
  roomSendPartialUpdate(socket, room);
}

export function roomEndGame(socket: MySocket, room: Room, winnerUser?: User) {
  room.state = "endGame";
  room.endTime = new Date();
  room.winnerUserId = winnerUser?.id;
  roomSendPartialUpdate(socket, room);
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
  roomSendPartialUpdate(socket, room);
}

export function roomUserReadyUp(socket: MySocket, room: Room, user: User) {
  userReadyUp(user, !user.ready);
  roomSendPartialUpdate(socket, room);
}

export function roomUserSurrender(socket: MySocket, room: Room, user: User) {
  userSurrender(user, !user.surrendered);
  if (user.surrendered) {
    roomSystemChat(socket, room, `${user.userName} voted to surrender`);
  }
  roomSendPartialUpdate(socket, room);
}

export function roomUpdateRules(
  socket: MySocket,
  room: Room,
  rules: Room["rules"]
) {
  room.rules = rules;
  roomSendPartialUpdate(socket, room);
}

export function roomUpdateChat(
  socket: MySocket,
  room: Room,
  user: User,
  message: string
) {
  const newMessage: RoomChatMessage = {
    message,
    __type: "userChat",
    userId: user.id,
    userName: user.userName,
  };

  room.chat.push(newMessage);

  if (room.chat.length > 500) {
    room.chat.shift();
  }

  socket.nsp.to(room.id).emit("room:chat:update", newMessage);
}

export function roomSystemChat(socket: MySocket, room: Room, message: string) {
  const newMessage: RoomSystemChatMessage = {
    message,
    __type: "systemChat",
  };

  room.chat.push(newMessage);

  if (room.chat.length > 500) {
    room.chat.shift();
  }

  socket.nsp.to(room.id).emit("room:chat:update", newMessage);
}

export function roomSendPartialUpdate(socket: MySocket, room: Room) {
  const { chat, disconnectedUsers, ...rest } = room;
  socket.nsp.to(room.id).emit("room:partial:update", rest);
}

export function roomRemove(roomId: string) {
  const room = roomStore.get(roomId);
  if (!room) {
    return;
  }
  // tell user that they are done!
  room.users.forEach((user) => userRemove(user.id));
  roomStore.delete(roomId);
}
