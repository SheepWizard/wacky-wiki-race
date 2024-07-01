import { ComponentChildren, createContext } from "preact";
import { MySocket } from "../socket";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { io } from "socket.io-client";
import { URL } from "../socket";
import { center } from "../../styled-system/patterns";

interface SessionContextProps {
  sessionId: string;
  userId: string;
  socket: MySocket;
}

const SessionContext = createContext<SessionContextProps | null>(null);

const sessionKey = "sessionId";
const userKey = "userId";

interface SessionProviderProps {
  children: ComponentChildren;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  const [sessionId, setSessionId] = useState(
    sessionStorage.getItem(sessionKey)
  );
  const [userId, setUserId] = useState(sessionStorage.getItem(userKey));

  const socket: MySocket = useMemo(() => io(URL), []);
  socket.auth = {
    sessionId: sessionId,
  };

  useEffect(() => {
    const handleSession = (_sessionId: string, _userId: string) => {
      sessionStorage.setItem(sessionKey, _sessionId);
      sessionStorage.setItem(userKey, _userId);
      setSessionId(_sessionId);
      setUserId(_userId);
    };

    socket.on("session", handleSession);

    return () => {
      socket.off("session", handleSession);
    };
  }, [socket]);

  useEffect(() => {
    socket.connect();
  }, [socket]);

  if (!sessionId || !userId) {
    return <h1 class={center()}>Loading</h1>;
  }

  return (
    <SessionContext.Provider value={{ sessionId, userId, socket }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);

  if (!ctx) {
    throw new Error("useSession must be used inside SessionContext");
  }

  return {
    sessionId: ctx.sessionId,
    userId: ctx.userId,
  };
}

export function useSocket() {
  const ctx = useContext(SessionContext);

  if (!ctx) {
    throw new Error("useSocket must be used inside SessionContext");
  }

  return ctx.socket;
}
