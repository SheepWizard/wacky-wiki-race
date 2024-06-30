import { generate } from "short-uuid";
import { MySocket } from "../socket";

interface SessionState {
  userId: string;
  lastUpdate: Date;
  oldRoomId?: string;
}

const sessions: Map<string, SessionState> = new Map();

export function sessionMiddleware(
  socket: MySocket,
  next: (err?: Error) => void
) {
  const sessionId = socket.handshake.auth.sessionId;

  const session = sessions.get(String(sessionId));

  if (!session) {
    socket.data.sessionId = generate();
    socket.data.userId = generate();
    sessions.set(socket.data.sessionId, {
      userId: socket.data.userId,
      lastUpdate: new Date(),
    });
    return next();
  }

  socket.data.sessionId = sessionId;
  socket.data.userId = session.userId;

  socket.onAny(() => {
    session.lastUpdate = new Date();
  });

  next();
}

export function getSession(id: string) {
  return sessions.get(id);
}

const sessionStorageTime = 1000 * 60 * 60;

setInterval(() => {
  for (let [sessionId, session] of sessions.entries()) {
    const diff = new Date().getTime() - session.lastUpdate.getTime();
    if (diff > sessionStorageTime) {
      sessions.delete(sessionId);
    }
  }
}, 5_000);
