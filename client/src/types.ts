export interface User {
  id: string;
  userName: string;
  roomId?: string;
  route: string[];
}

export interface Room {
  id: string;
  users: User[];
  state: "lobby" | "inGame" | "endGame";
  roomOwnerId: string;
  start: string;
  end: string;
  startTime: Date;
  endTime: Date;
  winnerUserId?: string;
}
