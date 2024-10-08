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
    excludeGroups: string[];
    noPageSearch: boolean;
  };
}
