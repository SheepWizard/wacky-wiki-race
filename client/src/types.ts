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
}

export interface RoomPartial extends Omit<Room, "chat" | "disconnectedUsers"> {}

export type Unarray<T> = T extends Array<infer R> ? R : never;
