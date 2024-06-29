import { Fragment } from "preact/jsx-runtime";
import { center, vstack } from "../../styled-system/patterns";
import { Room } from "../types";
import { socket } from "../socket";
import Button from "../components/Button";

interface EndGamePageProps {
  room: Room;
}

export default function EndGamePage({ room }: EndGamePageProps) {
  const isRoomOwner = room.roomOwnerId === socket.id;

  const handleNewGame = () => {
    socket.emit("room:lobby", room.id);
  };

  const winningUser = room.users.find((x) => x.id === room.winnerUserId);

  const otherUsers = room.users
    .filter((x) => x.id !== room.winnerUserId)
    .map((x) => ({
      userName: x.userName,
      route: x.route,
    }));

  return (
    <div class={center({ bg: "ww-yellow", h: "lvh" })}>
      <div class={vstack({ gap: 2 })}>
        <h1>Winner</h1>
        <h1>{winningUser?.userName}</h1>
        <ul class={vstack({})}>
          {winningUser?.route.map((pageName, index) => (
            <li key={index}>{pageName.replaceAll("_", " ")}</li>
          ))}
        </ul>
        {otherUsers.map((user, i) => {
          return (
            <Fragment key={i}>
              <h2>{user.userName}</h2>
              <ul class={vstack({})}>
                {user.route.map((pageTitle, index) => (
                  <li key={index}>{pageTitle}</li>
                ))}
              </ul>
            </Fragment>
          );
        })}
        {isRoomOwner && <Button onClick={handleNewGame}>New game</Button>}
      </div>
    </div>
  );
}
