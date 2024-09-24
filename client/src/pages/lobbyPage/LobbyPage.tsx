import { useEffect } from "preact/hooks";
import { wikiApiGetRandomPage } from "../../wiki";
import GreenBox from "../../components/GreenBox";
import Title from "../../components/Title";
import Button from "../../components/Button";
import { hstack } from "../../../styled-system/patterns";
import { css } from "../../../styled-system/css";
import { useRoom } from "../../providers/RoomProvider";
import { useSession, useSocket } from "../../providers/SessionProvider";
import RouteSelect from "./RouteSelect";
import FriendInvite from "./FriendInvite";
import UserList from "./UserList";
import Rules from "./Rules";

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

  return (
    <>
      <div
        class={css({
          bg: "ww-yellow",
          h: "lvh",
          overflow: "hidden",
          paddingBlock: 2,
        })}
      >
        <GreenBox>
          <Title />

          <FriendInvite />
          <UserList />
          <RouteSelect />
          <Rules />

          {isRoomOwner && (
            <Button
              onClick={handleStartGame}
              stretch
            >{`Start game ${room.users.length}/100`}</Button>
          )}
          <div class={hstack({ gap: 8, alignItems: "center" })}>
            <Button onClick={handleReadyUp}>Ready Up</Button>
            <Button onClick={handleRoomLeave}>Leave</Button>
          </div>
        </GreenBox>
      </div>
    </>
  );
}
