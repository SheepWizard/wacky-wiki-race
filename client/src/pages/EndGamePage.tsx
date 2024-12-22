import { css } from "../../styled-system/css";
import { center, hstack, vstack } from "../../styled-system/patterns";
import Button from "../components/Button";
import Kawaii from "../components/Kawaii";
import { useRoom } from "../providers/RoomProvider";
import { useSession, useSocket } from "../providers/SessionProvider";

export default function EndGamePage() {
  const socket = useSocket();
  const { userId } = useSession();
  const { setRoom, room } = useRoom();

  if (!room) {
    return null;
  }

  const isRoomOwner = room.roomOwnerId === userId;

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
      id: x.id,
      userName: x.userName,
      route: x.route,
    }));

  const users = winningUser ? [winningUser, ...otherUsers] : otherUsers;

  return (
    <div class={center({ bg: "ww-primary-10", h: "lvh", paddingBlock: 2 })}>
      <Kawaii />
      <div
        class={vstack({
          gap: 2,
          h: "lvh",
          paddingBlock: 2,
          overflowX: "hidden",
          pos: "relative",
        })}
      >
        {winningUser ? (
          <>
            <h1>Winner</h1>
            <h1>{winningUser.userName}</h1>
          </>
        ) : (
          <h1>Surrender</h1>
        )}
        <ul
          class={hstack({
            overflowX: "auto",
            scrollbar: "hidden",
            w: "full",
            gap: 3,
            flexGrow: 1,
            maxHeight: "600px",
            overflowY: "auto",
          })}
        >
          <li>
            <div class={css({ w: "calc(100vw / 2 - 200px)", h: 1 })}></div>
          </li>
          {users.map((user, i) => {
            return (
              <li
                key={i}
                class={vstack({
                  marginInline: 2,
                  bg: "ww-white",
                  borderRadius: "br-25",
                  border: "solid 2px",
                  borderColor: "ww-black",
                  p: 6,
                  h:
                    winningUser?.id === user.id
                      ? "calc(100% - 20px)"
                      : "calc(100% - 80px)",
                  minW: "min(90vw, 400px)",
                  maxW: "min(90vw, 400px)",
                  textAlign: "center",
                  overflowX: "auto",
                })}
              >
                {winningUser?.id === user.id && <h1>Winner</h1>}
                <h2>{user.userName}</h2>
                <ul class={vstack()}>
                  {user.route.map((pageTitle, index) => (
                    <li key={index}>{pageTitle.title.replaceAll("_", " ")}</li>
                  ))}
                </ul>
              </li>
            );
          })}
          <li>
            <div class={css({ w: "calc(100vw / 2 - 200px)", h: 1 })}></div>
          </li>
        </ul>
        <div class={hstack({ gap: 4 })}>
          {isRoomOwner && (
            <Button style="secondary" onClick={handleNewGame}>
              New game
            </Button>
          )}
          <Button onClick={handleRoomLeave}>Leave</Button>
        </div>
      </div>
    </div>
  );
}
