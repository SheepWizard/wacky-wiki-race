export interface User {
  id: string;
  userName: string;
  roomId?: string;
  route: string[];
}

export const users: Map<string, User> = new Map();

export function createUser(id: string, userName: string) {
  const user: User = {
    id,
    userName,
    route: [],
  };
  users.set(id, user);
  return user;
}

export function removeUser(id: string) {
  users.delete(id);
}

export function addUser(user: User) {
  users.set(user.id, user);
}

export function getUserById(id: string) {
  return users.get(id);
}

export function addToUserRoute(user: User, route: string) {
  if (user.route.length > 100) {
    user.route.shift();
  }
  user.route.push(route);
}

export function clearRoutes(user: User) {
  user.route = [];
}
