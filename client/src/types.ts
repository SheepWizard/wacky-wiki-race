export interface User {
  id: string;
  userName: string;
  roomId?: string;
  route: string[];
  ready: boolean;
  surrendered: boolean;
}

export interface Room {
  id: string;
  users: User[];
  disconnectedUsers: User[];
  state: "lobby" | "inGame" | "endGame";
  roomOwnerId: string;
  start: string;
  end: string;
  startTime: Date;
  endTime: Date;
  winnerUserId?: string;
  rules: {
    excludeGroups: Array<"countries" | "events" | "celebrities">;
    noPageSearch: boolean;
  };
}
