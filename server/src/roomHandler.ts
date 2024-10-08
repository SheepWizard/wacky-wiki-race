import {
  roomAddUser,
  roomCheckWin,
  roomCreate,
  roomEndGame,
  roomGetById,
  roomPlay,
  roomReAddUser,
  roomRemoveUser,
  roomReset,
  roomSetEnd,
  roomSetStart,
  roomToggleExcludeGroup,
  roomUserReadyUp,
  roomUserSurrender,
} from "./room.js";
import { MySocket } from "./socket.js";
import z from "zod";
import { getSession } from "./middleware/sessionMiddleware.js";
import {
  userAdd,
  userAddToRoute,
  userCreate,
  userGetById,
  userRemove,
  WikiPage,
} from "./user.js";

export function handleRoomCreate(socket: MySocket, userName: string) {
  const validator = z.string().max(25);
  const result = validator.safeParse(userName);
  if (!result.success) {
    //add error
    return;
  }

  const user = userCreate(socket.data.userId, userName);
  const room = roomCreate(user);
  roomAddUser(socket, room, user);
}

export function handleRoomReJoin(socket: MySocket, roomId: string) {
  const room = roomGetById(roomId);
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

  userAdd(foundUser);
  roomReAddUser(socket, room, foundUser);
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

  const room = roomGetById(roomId);
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

  const user = userCreate(socket.data.userId, userName);
  roomAddUser(socket, room, user);
}

export function handleRoomLeave(socket: MySocket, disconnected: boolean) {
  const user = userGetById(socket.data.userId);
  if (!user) {
    console.log("No user");
    return;
  }
  userRemove(user.id);

  const room = roomGetById(user.roomId ?? "");
  if (!room) {
    console.log("No room");
    return;
  }

  if (disconnected) {
    const session = getSession(socket.data.sessionId);
    if (session) {
      session.oldRoomId = room.id;
    }
  }
  roomRemoveUser(socket, room, user, disconnected);

  if (room.users.length > 1) {
    const allSurrendered = room.users.every((x) => x.surrendered);
    if (allSurrendered) {
      roomReset(socket, room);
    }
  }
}

export function handleRoomPlay(socket: MySocket, roomId: string) {
  const validator = z.string();
  const result = validator.safeParse(roomId);
  if (!result.success) {
    //add error
    return;
  }

  const room = roomGetById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = userGetById(socket.data.userId);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }

  room.users.forEach((user) => userAddToRoute(user, room.start));

  roomPlay(socket, room);
}

export function handleRoomSetStart(
  socket: MySocket,
  roomId: string,
  start: WikiPage
) {
  const validator = z.object({
    roomId: z.string(),
    start: z.object({
      title: z.string().max(500),
      pageId: z.number(),
    }),
  });
  const result = validator.safeParse({
    roomId,
    start,
  });
  if (!result.success) {
    console.log(result.error);
    return;
  }

  const room = roomGetById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = userGetById(socket.data.userId);
  if (!user) {
    return;
  }

  // if (room.roomOwnerId !== user.id) {
  //   return;
  // }
  roomSetStart(socket, room, start);
}

export function handleRoomSetEnd(
  socket: MySocket,
  roomId: string,
  end: WikiPage
) {
  const validator = z.object({
    roomId: z.string(),
    end: z.object({
      title: z.string().max(500),
      pageId: z.number(),
    }),
  });
  const result = validator.safeParse({
    roomId,
    end,
  });
  if (!result.success) {
    //add error
    return;
  }

  const room = roomGetById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = userGetById(socket.data.userId);
  if (!user) {
    return;
  }

  // if (room.roomOwnerId !== user.id) {
  //   return;
  // }

  roomSetEnd(socket, room, end);
}

export function handleUserRoute(
  socket: MySocket,
  roomId: string,
  route: WikiPage
) {
  const validator = z.object({
    roomId: z.string(),
    route: z.object({
      title: z.string().max(500),
      pageId: z.number(),
    }),
  });
  const result = validator.safeParse({
    roomId,
    route,
  });
  if (!result.success) {
    //add error
    return;
  }

  const room = roomGetById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "inGame") {
    return;
  }

  const user = userGetById(socket.data.userId);
  if (!user) {
    return;
  }

  const found = room.users.some((x) => x.id === user.id);
  if (!found) {
    return;
  }
  userAddToRoute(user, route);

  const won = roomCheckWin(room, route);

  if (!won) {
    return;
  }

  roomEndGame(socket, room, user);
}

export function handleRoomLobby(socket: MySocket, roomId: string) {
  const validator = z.string();
  const result = validator.safeParse(roomId);
  if (!result.success) {
    //add error
    return;
  }

  const room = roomGetById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "endGame") {
    return;
  }

  const user = userGetById(socket.data.userId);
  if (!user) {
    return;
  }

  if (room.roomOwnerId !== user.id) {
    return;
  }

  roomReset(socket, room);
}

export function handleRoomReadyUp(socket: MySocket, roomId: string) {
  const validator = z.string();
  const result = validator.safeParse(roomId);
  if (!result.success) {
    //add error
    return;
  }
  const room = roomGetById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = userGetById(socket.data.userId);
  if (!user) {
    return;
  }

  const found = room.users.some((x) => x.id === user.id);
  if (!found) {
    return;
  }

  roomUserReadyUp(socket, room, user);
}

export function handleRoomSurrender(socket: MySocket, roomId: string) {
  const validator = z.string();
  const result = validator.safeParse(roomId);
  if (!result.success) {
    //add error
    return;
  }

  const room = roomGetById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "inGame") {
    return;
  }

  const user = userGetById(socket.data.userId);
  if (!user) {
    return;
  }

  const found = room.users.some((x) => x.id === user.id);
  if (!found) {
    return;
  }

  roomUserSurrender(socket, room, user);

  const allSurrendered = room.users.every((x) => x.surrendered);

  if (!allSurrendered) {
    return;
  }

  roomEndGame(socket, room);
}

export function handleExcludeGroup(
  socket: MySocket,
  roomId: string,
  excludeGroup: string
) {
  const validator = z.object({
    roomId: z.string(),
    excludeGroup: z.string(),
  });
  const result = validator.safeParse({ roomId, excludeGroup });
  if (!result.success) {
    //add error
    return;
  }

  const room = roomGetById(roomId);
  if (!room) {
    return;
  }

  if (room.state !== "lobby") {
    return;
  }

  const user = userGetById(socket.data.userId);
  if (!user) {
    return;
  }

  const found = room.users.some((x) => x.id === user.id);
  if (!found) {
    return;
  }

  roomToggleExcludeGroup(socket, room, excludeGroup);
}
