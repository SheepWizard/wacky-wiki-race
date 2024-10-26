import { Room, roomRemove } from "./room.js";

const roomStorageTime = 1000 * 60 * 60;
export const roomStore: Map<string, Room> = new Map();

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj;

export function watchProxy<T extends { lastAccessed: Date }>(obj: T) {
  const proxy = new Proxy<T & { lastAccessed: Date }>(obj, {
    get: (target, key) => {
      if (key !== "lastAccessed") {
        target.lastAccessed = new Date();
      }
      return hasKey(target, key) ? target[key] : undefined;
    },
    set: (target, key, newValue) => {
      target.lastAccessed = new Date();
      // @ts-ignore
      target[key] = newValue;
      return true;
    },
  });
  return proxy;
}

export function watchStore() {
  setInterval(() => {
    for (let [roomId, room] of roomStore.entries()) {
      const diff = new Date().getTime() - room.lastAccessed.getTime();
      if (diff > roomStorageTime) {
        room.users.entries;
        roomRemove(roomId);
      }
    }
  }, 5_000);
}
