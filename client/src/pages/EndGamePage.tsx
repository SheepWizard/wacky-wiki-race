import { center, hstack, vstack } from "../../styled-system/patterns";
import Button from "../components/Button";
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
      userName: x.userName,
      route: x.route,
    }));

  const users = winningUser ? [winningUser, ...otherUsers] : otherUsers;

  return (
    <div class={center({ bg: "ww-yellow", h: "lvh" })}>
      <div
        class={vstack({
          gap: 2,
          h: "lvh",
          paddingBlock: 2,
          overflowX: "hidden",
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
            overflowY: "hidden",
            scrollbar: "hidden",
            w: "full",
            gap: 3,
            flexGrow: 1,
            maxHeight: "600px",
          })}
        >
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
                  boxShadow: "ww-mid",
                  h: "calc(100% - 20px)",
                })}
              >
                <h2>{user.userName}</h2>
                <ul class={vstack()}>
                  {user.route.map((pageTitle, index) => (
                    <li key={index}>{pageTitle.title.replaceAll("_", " ")}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <div class={hstack({ gap: 4 })}>
          {isRoomOwner && <Button onClick={handleNewGame}>New game</Button>}
          <Button onClick={handleRoomLeave}>Leave</Button>
        </div>
      </div>
    </div>
  );
}
