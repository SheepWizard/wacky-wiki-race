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

export const users: Map<string, User> = new Map();

export function userCreate(id: string, userName: string) {
  const user: User = {
    id,
    userName,
    route: [],
    ready: false,
    surrendered: false,
  };
  users.set(id, user);
  return user;
}

export function userRemove(id: string) {
  users.delete(id);
}

export function userAdd(user: User) {
  users.set(user.id, user);
}

export function userGetById(id: string) {
  return users.get(id);
}

export function userAddToRoute(user: User, route: WikiPage) {
  if (user.route.length > 100) {
    user.route.shift();
  }
  user.route.push(route);
}

export function userClearRoutes(user: User) {
  user.route = [];
}

export function userReadyUp(user: User, ready: boolean) {
  user.ready = ready;
}

export function userSurrender(user: User, surrender: boolean) {
  user.surrendered = surrender;
}

// add user cleanup on timer
