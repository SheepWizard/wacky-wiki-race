import { Fragment } from "preact/jsx-runtime";
import { center, vstack } from "../../styled-system/patterns";
import { Room } from "../types";
import Button from "../components/Button";
import { useRoom } from "../providers/RoomProvider";
import { useSession, useSocket } from "../providers/SessionProvider";
import Chat from "../components/chat/Chat";

interface EndGamePageProps {
  room: Room;
}

export default function EndGamePage({ room }: EndGamePageProps) {
  const socket = useSocket();
  const { userId } = useSession();
  const isRoomOwner = room.roomOwnerId === userId;
  const { setRoom } = useRoom();

  const handleNewGame = () => {
    socket.emit("room:lobby", room.id);
  };

  const handleRoomLeave = () => {
    socket.emit("room:leave");
    setRoom(undefined);
  };

  const winningUser = room.users.find((x) => x.id === room.winnerUserId);

  const otherUsers = room.users
    .filter((x) => x.id !== room.winnerUserId)
    .map((x) => ({
      userName: x.userName,
      route: x.route,
    }));

  return (
    <div class={center({ bg: "ww-yellow", h: "lvh", overflowY: "auto" })}>
      <div class={vstack({ gap: 2 })}>
        {winningUser ? (
          <>
            <h1>Winner</h1>
            <h1>{winningUser.userName}</h1>
          </>
        ) : (
          <h1>Surrender</h1>
        )}
        <ul class={vstack({})}>
          {winningUser?.route.map((pageName, index) => (
            <li key={index}>{pageName.title.replaceAll("_", " ")}</li>
          ))}
        </ul>
        {otherUsers.map((user, i) => {
          return (
            <Fragment key={i}>
              <h2>{user.userName}</h2>
              <ul class={vstack({})}>
                {user.route.map((pageTitle, index) => (
                  <li key={index}>{pageTitle.title.replaceAll("_", " ")}</li>
                ))}
              </ul>
            </Fragment>
          );
        })}
        {isRoomOwner && <Button onClick={handleNewGame}>New game</Button>}
        <Button onClick={handleRoomLeave}>Leave</Button>
      </div>
      <Chat />
    </div>
  );
}
