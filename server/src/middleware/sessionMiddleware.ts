import { generate } from "short-uuid";
import { MySocket } from "../socket";

interface SessionState {
  userId: string;
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
    });
    return next();
  }

  socket.data.sessionId = sessionId;
  socket.data.userId = session.userId;
  next();
}
