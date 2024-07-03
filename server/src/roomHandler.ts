import {
  addToUserRoute,
  addUser,
  createUser,
  getUserById,
  removeUser,
} from "./user.js";
import {
  addUserToRoom,
  checkWin,
  createRoom,
  getRoomById,
  reAddUserToRoom,
  removeUserFromRoom,
  resetRoom,
  roomPlay,
  roomSetEnd,
  roomSetStart,
  userReadyUp,
  userSurrender,
} from "./room.js";
import { MySocket } from "./socket.js";
import z from "zod";
import { getSession } from "./middleware/sessionMiddleware.js";

export function handleRoomCreate(socket: MySocket, userName: string) {
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

export function handleRoomReJoin(socket: MySocket, roomId: string) {
  const room = getRoomById(roomId);
  if (!room) {
    // add error
    console.log("No room");
    return;
  }

  if (room.users.length >= 100) {
    // add error
    console.log("Too many users");
    return;
  }

  const foundUser = room.disconnectedUsers.find(
    (x) => x.id === socket.data.userId
  );
  if (!foundUser) {
    console.log("User not found");
    return;
  }

  addUser(foundUser);
  reAddUserToRoom(socket, room, foundUser);
}

export function handleRoomJoin(
  socket: MySocket,
  roomId: string,
  userName: string
) {
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

export function handleRoomLeave(socket: MySocket, disconnected: boolean) {
  console.log("Disconnect");
  const user = getUserById(socket.data.userId);
  if (!user) {
    console.log("No user");
    return;
  }
  removeUser(user.id);

  const room = getRoomById(user.roomId ?? "");
  if (!room) {
    console.log("No room");
    return;
  }

  console.log("on disconnect", disconnected);
  if (disconnected) {
    const session = getSession(socket.data.sessionId);
    if (session) {
      session.oldRoomId = room.id;
    }
  }

  removeUserFromRoom(socket, room, user, disconnected);

  const allSurrendered = room.users.every((x) => x.surrendered);

  if (!allSurrendered) {
    return;
  }

  resetRoom(socket, room);
}

export function handleRoomPlay(socket: MySocket, roomId: string) {
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

  // if (room.roomOwnerId !== user.id) {
  //   return;
  // }

  start = start.replace(/\u00AD/g, "");
  roomSetStart(socket, room, start);
}

export function handleRoomSetEnd(
  socket: MySocket,
  roomId: string,
  end: string
) {
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

  // if (room.roomOwnerId !== user.id) {
  //   return;
  // }

  end = end.replace(/\u00AD/g, "");
  roomSetEnd(socket, room, end);
}

export function handleUserRoute(
  socket: MySocket,
  roomId: string,
  route: string
) {
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

export function handleRoomLobby(socket: MySocket, roomId: string) {
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

export function handleRoomReadyUp(socket: MySocket, roomId: string) {
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

  const found = room.users.some((x) => x.id === user.id);
  if (!found) {
    return;
  }

  userReadyUp(socket, room, user);
}

export function handleRoomSurrender(socket: MySocket, roomId: string) {
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

  userSurrender(socket, room, user);

  const allSurrendered = room.users.every((x) => x.surrendered);

  if (!allSurrendered) {
    return;
  }

  resetRoom(socket, room);
}
