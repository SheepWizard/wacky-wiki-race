export interface WikiPage {
  title: string;
  pageId: number;
}

export interface User {
  id: string;
  userName: string;
  roomId?: string;
  route: WikiPage[];
  ready: boolean;
  surrendered: boolean;
}

interface RoomChatMessage {
  userId: string;
  userName: string;
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
  chat: Array<RoomChatMessage>;
}

export type Unarray<T> = T extends Array<infer R> ? R : never;
