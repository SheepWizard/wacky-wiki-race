import { useEffect } from "preact/hooks";
import { socket } from "../socket";

const sessionKey = "sessionId";
const userKey = "userId";

export function useSocketSession() {
  useEffect(() => {
    const handleSession = (sessionId: string, userId: string) => {
      sessionStorage.setItem(sessionKey, sessionId);
      sessionStorage.setItem(userKey, userId);
      socket.auth = { sessionId };
    };

    socket.on("session", handleSession);

    return () => {
      socket.off("session", handleSession);
    };
  }, []);
}

export function getSessionId() {
  return sessionStorage.getItem(sessionKey);
}

export function getUserId() {
  return sessionStorage.getItem(userKey);
}
