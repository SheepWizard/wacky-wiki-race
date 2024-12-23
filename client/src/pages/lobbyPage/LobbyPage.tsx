import { useEffect } from "preact/hooks";
import { css } from "../../../styled-system/css";
import { hstack } from "../../../styled-system/patterns";
import Button from "../../components/Button";
import GreenBox from "../../components/GreenBox";
import Kawaii from "../../components/Kawaii";
import Title from "../../components/Title";
import { useRoom } from "../../providers/RoomProvider";
import { useSession, useSocket } from "../../providers/SessionProvider";
import { wikiApiGetRandomPage } from "../../wiki";
import Admin from "./Admin";
import FriendInvite from "./FriendInvite";
import RouteSelect from "./RouteSelect";
import Rules from "./Rules";
import UserList from "./UserList";

export default function LobbyPage() {
  const { userId } = useSession();
  const socket = useSocket();
  const { setRoom, room } = useRoom();

  if (!room) {
    return null;
  }

  const isRoomOwner = room.roomOwnerId === userId;

  useEffect(() => {
    if (!isRoomOwner) {
      return;
    }
    // move to server
    const getRandom = async () => {
      try {
        const randomStartPromise = wikiApiGetRandomPage();

        const randomEndPromise = wikiApiGetRandomPage();
        const results = await Promise.all([
          randomStartPromise,
          randomEndPromise,
        ]);

        socket.emit("room:set:start", room.id, results[0]);
        socket.emit("room:set:end", room.id, results[1]);
      } catch {}
    };

    getRandom();
  }, [room.id]);

  const handleStartGame = () => {
    socket.emit("room:play", room.id);
  };

  const handleRoomLeave = () => {
    socket.emit("room:leave");
    setRoom(undefined);
  };

  const handleReadyUp = () => {
    socket.emit("room:user:readyUp", room.id);
  };

  const user = room.users.find((x) => x.id === userId);
  const lockRules = !isRoomOwner && room.adminRules.lockRules;

  return (
    <>
      <div
        class={css({
          bg: "ww-primary-10",
          h: "lvh",
          overflow: "hidden",
        })}
      >
        <Kawaii />
        <GreenBox>
          <Title />

          <FriendInvite />
          <UserList />
          <RouteSelect />
          <div class={hstack({ gap: 6, w: "100%", flexWrap: "wrap" })}>
            {isRoomOwner && <Admin />}
            {!lockRules && <Rules />}
            <Button onClick={handleReadyUp}>
              {user?.ready ? "Unready" : "Ready Up"}
            </Button>
            <Button onClick={handleRoomLeave}>Leave</Button>
          </div>

          {isRoomOwner && (
            <Button
              onClick={handleStartGame}
              stretch
              style="secondary"
            >{`Start game ${room.users.length}/100`}</Button>
          )}
        </GreenBox>
      </div>
    </>
  );
}
