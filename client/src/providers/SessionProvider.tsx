import { ComponentChildren, createContext } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { io } from "socket.io-client";
import { center } from "../../styled-system/patterns";
import { MySocket, URL } from "../socket";

interface SessionContextProps {
  sessionId: string;
  userId: string;
  socket: MySocket;
  isConnected: boolean;
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
  const socket: MySocket = useMemo(
    () =>
      io(URL, {
        reconnectionDelay: 300,
        transports: ["websocket", "polling"],
      }),
    []
  );
  socket.auth = {
    sessionId: sessionId,
  };
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleSession = (_sessionId: string, _userId: string) => {
      sessionStorage.setItem(sessionKey, _sessionId);
      sessionStorage.setItem(userKey, _userId);
      setSessionId(_sessionId);
      setUserId(_userId);
    };

    const handleConnectError = () => {
      // revert to classic upgrade
      socket.io.opts.transports = ["polling", "websocket"];
      setIsConnected(false);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      socket.connect();
    };

    const handleConnect = () => {
      setIsConnected(true);
    };

    socket.on("session", handleSession);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("session", handleSession);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [socket]);

  useEffect(() => {
    socket.connect();
  }, [socket]);

  useEffect(() => {
    if (sessionId && userId) {
      return;
    }

    const timeout = setTimeout(() => {
      socket.disconnect();
    }, 1000);

    return () => clearTimeout(timeout);
  });

  if (!sessionId || !userId) {
    return <h1 class={center()}>Loading</h1>;
  }

  return (
    <SessionContext.Provider value={{ sessionId, userId, socket, isConnected }}>
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
    isConnected: ctx.isConnected,
  };
}

export function useSocket() {
  const ctx = useContext(SessionContext);

  if (!ctx) {
    throw new Error("useSocket must be used inside SessionContext");
  }

  return ctx.socket;
}
